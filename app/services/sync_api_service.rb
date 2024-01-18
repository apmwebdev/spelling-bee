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
  # :nodoc:
  class SyncApiLogger < Logger
    def initialize
      super("log/sync_api.log", "weekly")
      @formatter = proc do |severity, datetime, _progname, msg|
        timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
        "#{severity} #{timestamp} - #{msg}\n"
      end
    end
  end

  def initialize
    @logger = SyncApiLogger.new
    @validator = SyncApiValidator.new(@logger)
  end

  # The puzzle data for the Sync API is paginated, so this method is for getting one page of data
  # at a time, which is 50 puzzles. This method is called in a loop by the `sync_recent_puzzles`
  # method until it gets to the most recent puzzle.
  def sync_one_page_of_puzzle_data(first_puzzle_identifier)
    base_msg = "sync_one_page_of_puzzle_data"
    @logger.info "#{base_msg}: Starting with #{first_puzzle_identifier}"
    url = "#{ENV['PRODUCTION_SYNC_API_URL']}/sync_recent_puzzles/#{first_puzzle_identifier}"
    authorization_token = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}"
    response = URI::HTTPS.open(url, "Authorization" => authorization_token).read
    begin
      json = JSON.parse(response)
    rescue JSON::ParserError => e
      error_message = "#{base_msg}: Unable to parse JSON response for Sync API: #{e.inspect}"
      @logger.error error_message
      return { error: error_message }
    end
    unless @validator.valid?(json)
      error_message = "#{base_msg}: Invalid Sync API response"
      @logger.error error_message
      return { error: error_message }
    end
    @logger.info "#{base_msg}: Begin loop through data array"
    json["data"].each do |item|
      puzzle_data = item["puzzle_data"]
      puzzle_id = puzzle_data["id"].to_i
      @logger.info "#{base_msg}: Syncing puzzle #{puzzle_id}"
      existing_puzzle = Puzzle.find_by(id: puzzle_id)
      if existing_puzzle && Date.parse(puzzle_data["date"]) == existing_puzzle.date
        @logger.info "#{base_msg}: Data for puzzle #{puzzle_id} already matches. Skipping."
        next
      end

      update_or_create_puzzle(item, existing_puzzle)
    end
    json
  end

  def sync_recent_puzzles(first_puzzle_identifier)
    base_msg = "sync_recent_puzzles"
    @logger.info "#{base_msg}: Starting with #{first_puzzle_identifier}"
    starting_identifier = first_puzzle_identifier
    loop do
      @logger.info "#{base_msg}: Iterating loop"
      result = sync_one_page_of_puzzle_data(starting_identifier)
      if result[:error]
        @logger.error "#{base_msg}: Error returned. Breaking loop."
        break
      end
      if result["data"].length < 50
        @logger.info "#{base_msg}: Data length < 50. Last puzzle reached. Breaking loop."
        break
      end
      starting_identifier = result["last_id"].to_i + 1
    end
  end

  def update_or_create_puzzle(data_hash, existing_puzzle)
    puzzle_data, origin_data, answer_words = data_hash.values_at("puzzle_data", "origin_data", "answer_words")

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
        @logger.info "Fetching datamuse data for \"#{answer_word}\"."
        datamuse_data = DatamuseApiService.get_word_data(answer_word)
        word.frequency = datamuse_data[:frequency]
        word.definitions = datamuse_data[:definitions]
        word.save!
      else
        @logger.info "Datamuse data already exists for \"#{answer_word}\"."
      end
      Answer.create!({ puzzle:, word_text: answer_word })
    end
  end
end
