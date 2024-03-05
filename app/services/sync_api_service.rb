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
require "net/http"
require "uri"

# This is the service that is the client half of the Sync API. It is designed to be used by a dev
# environment to get the most up-to-date puzzle data from the production environment.
class SyncApiService
  BASE_URL = ENV["PRODUCTION_SYNC_API_URL"]
  AUTH_TOKEN = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}".freeze

  attr_accessor :logger, :validator

  def initialize
    @logger = ContextualLogger.new("log/sync_api.log", "weekly")
    @validator = Validator.new(@logger)
  end

  def send_get_request(path)
    full_url = "#{BASE_URL}#{path}"
    response = URI.open(full_url, "Authorization" => AUTH_TOKEN)&.read
    raise TypeError, "Response is nil. Exiting." unless response

    JSON.parse(response, symbolize_names: true)
  end

  def send_post_request(path, body)
    full_url = "#{BASE_URL}#{path}"
    uri = URI.parse(full_url)
    http = Net::HTTP.new(uri.host || "", uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request.content_type = "application/json"
    request["Authorization"] = AUTH_TOKEN
    request.body = JSON.dump(body)

    response = http.request(request)

    JSON.parse(response.body, symbolize_names: true)
  end

  # The puzzle data for the Sync API is paginated, so this method is for getting one page of data
  # at a time, which is 50 puzzles. This method is called in a loop by the `sync_recent_puzzles`
  # method until it gets to the most recent puzzle.
  def sync_puzzle_batch(first_puzzle_identifier)
    @logger.info "Starting with #{first_puzzle_identifier}"
    path = "/recent_puzzles/#{first_puzzle_identifier}"
    response = send_get_request(path)

    @validator.valid_puzzle_response!(response)

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

  def sync_puzzles(first_puzzle_identifier)
    @logger.info "Starting with #{first_puzzle_identifier}"
    starting_identifier = first_puzzle_identifier
    loop do
      @logger.info "Iterating loop"
      response = sync_puzzle_batch(starting_identifier)
      raise ApiError, "Error returned: #{response[:error]}" if response[:error]

      if response["data"].length < 50
        @logger.info "Data length < 50. Last puzzle reached. Exiting"
        break
      end

      starting_identifier = result["last_id"].to_i + 1
    end
  rescue StandardError => e
    @logger.exception(e, :fatal)
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

  def send_hint_request(page)
    path = "/word_hints/#{page}"
    send_get_request(path)
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

  def query_instruction_count
    path = "/instructions/count"
    response = send_get_request(path)
    raise ApiError, "Error: #{response[:error]}" if response[:error]
    response[:data]
  end

  def send_instructions
    instruction_count = query_instruction_count
    instructions = OpenaiHintInstruction.offset(instruction_count).each.map(&:to_hash)
    return @logger.info "Instructions already fully synced. Exiting" if instructions.empty?
    path = "/instructions/sync"
    response = send_post_request(path, { instructions: })
    raise ApiError, "Error sending instructions: #{response[:error]}" if response[:error]
    @logger.info "Instructions sent successfully: #{response[:success]}"
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end
end
