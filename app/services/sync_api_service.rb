# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

require "open-uri"

# This is the service that is the client half of the Sync API. It is designed to be used by a dev
# environment to get the most up-to-date puzzle data from the production environment.
class SyncApiService
  BASE_URL = ENV["PRODUCTION_SYNC_API_URL"]

  attr_accessor :logger, :validator

  def initialize
    @logger = ContextualLogger.new("log/sync_api.log", "weekly")
    @validator = Validator.new(@logger)
  end

  # The puzzle data for the Sync API is paginated, so this method is for getting one page of data
  # at a time, which is 50 puzzles. This method is called in a loop by the `sync_recent_puzzles`
  # method until it gets to the most recent puzzle.
  def sync_one_page_of_puzzle_data(first_puzzle_identifier)
    handle_error = lambda do |msg|
      @logger.fatal msg
      { error: msg }
    end
    @logger.info "Starting with #{first_puzzle_identifier}"
    url = "#{ENV['PRODUCTION_SYNC_API_URL']}/recent_puzzles/#{first_puzzle_identifier}"
    authorization_token = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}"
    response = URI.open(url, "Authorization" => authorization_token)&.read
    return handle_error.call("Response is nil. Exiting.") unless response

    begin
      json = JSON.parse(response)
    rescue JSON::ParserError => e
      return handle_error.call("Unable to parse JSON response for Sync API: #{e.inspect}")
    end

    return handle_error.call("Invalid Sync API response") unless @validator.valid?(json)

    @logger.info "Begin loop through data array"
    json["data"].each do |item|
      puzzle_data = item["puzzle_data"]
      puzzle_id = puzzle_data["id"].to_i
      @logger.info "Syncing puzzle #{puzzle_id}"
      existing_puzzle = Puzzle.find_by(id: puzzle_id)
      if existing_puzzle && Date.parse(puzzle_data["date"]) == existing_puzzle.date
        @logger.info "Data for puzzle #{puzzle_id} already matches. Skipping."
        next
      end

      update_or_create_puzzle(item, existing_puzzle)
    end
    json
  end

  def sync_recent_puzzles(first_puzzle_identifier)
    @logger.info "Starting with #{first_puzzle_identifier}"
    starting_identifier = first_puzzle_identifier
    loop do
      @logger.info "Iterating loop"
      result = sync_one_page_of_puzzle_data(starting_identifier)
      if result[:error]
        @logger.error "Error returned. Breaking loop."
        break
      end
      if result["data"].length < 50
        @logger.info "Data length < 50. Last puzzle reached. Breaking loop."
        break
      end
      starting_identifier = result["last_id"].to_i + 1
    end
  end

  def update_or_create_puzzle(data_hash, existing_puzzle)
    puzzle_data, origin_data, answer_words =
      data_hash.values_at("puzzle_data", "origin_data", "answer_words")

    update_or_create_origin(puzzle_data, origin_data)

    if existing_puzzle.nil?
      puzzle = Puzzle.create!(puzzle_data)
    else
      puzzle = existing_puzzle
      puzzle.update!(puzzle_data)
      puzzle.answers.destroy_all
      puzzle.user_puzzle_attempts.destroy_all
    end

    create_answers(puzzle, answer_words)
  end

  def update_or_create_origin(puzzle_data, origin_data)
    if puzzle_data["origin_type"] == "NytPuzzle"
      existing_origin = NytPuzzle.find_by(id: origin_data["id"].to_i)
      return NytPuzzle.create!(origin_data) unless existing_origin

      existing_origin.update!(origin_data)
    elsif puzzle_data["origin_type"] == "SbSolverPuzzle"
      existing_origin = SbSolverPuzzle.find_by(id: origin_data["id"].to_i)
      return SbSolverPuzzle.create!(origin_data) unless existing_origin

      existing_origin.update!(origin_data)
    else
      raise ApiError, "Invalid origin type: #{puzzle_data['origin_type']}"
    end
  end

  def create_answers(puzzle, answer_words)
    answer_words.each do |answer_word|
      word = Word.create_or_find_by({ text: answer_word })
      if word.frequency.nil?
        @logger.debug "Fetching datamuse data for \"#{answer_word}\"."
        datamuse_data = DatamuseApiService.get_word_data(answer_word)
        word.frequency = datamuse_data[:frequency]
        word.definitions = datamuse_data[:definitions]
        word.save!
      else
        @logger.debug "Datamuse data already exists for \"#{answer_word}\"."
      end
      Answer.create!({ puzzle:, word_text: answer_word })
    end
  end

  def send_request(path)
    full_url = "#{BASE_URL}#{path}"
    authorization_token = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}"
    response = URI.open(full_url, "Authorization" => authorization_token)&.read
    raise TypeError, "Response is nil. Exiting." unless response

    JSON.parse(response, symbolize_names: true)
  end

  def send_hint_request(page)
    path = "/word_hints/#{page}"
    send_request(path)
  end

  def sync_hint_batch(page)
    @logger.info "Starting hint batch, page: #{page}"
    response = send_hint_request(page)

    @validator.valid_hint_response!(response)

    response.data.each do |word_hint|
      word = Word.find(word_hint[:word])
      word.hint = word_hint[:hint]
      word.save!
    end
    @logger.info "Batch complete"
    response
  end

  def sync_hints
    @logger.info "Starting hint sync..."
    page = 0
    loop do
      @logger.info "Iterating loop, page: #{page}"
      response = sync_hint_batch(page)

      raise ApiError, "Error returned: #{response[:error]}" if response[:error]

      if response[:data].length < 1000
        @logger.info "Data length < 1000. All hints synced successfully. Exiting"
        break
      end

      page += 1
    end
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end
end
