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
  include BasicValidator

  BASE_URL = ENV["PRODUCTION_SYNC_API_URL"]
  AUTH_TOKEN = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}".freeze

  attr_reader :logger, :validator

  def initialize(logger: nil, validator: nil)
    self.logger = logger
    self.validator = validator
  end

  def send_get_request(path)
    full_url = "#{BASE_URL}#{path}"
    response = URI.open(full_url, "Authorization" => AUTH_TOKEN)&.read
    raise TypeError, "Response is nil. Exiting." unless response

    response = JSON.parse(response, symbolize_names: true)
    raise ApiError, "Error: #{response[:error]}" if response[:error]
    response
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
  def sync_puzzle_batch(starting_id, page_size:)
    @logger.info "Starting with #{starting_id}"
    path = "/recent_puzzles/#{starting_id}?limit=#{page_size}"
    response = send_get_request(path)

    @validator.valid_puzzle_response!(response)

    @logger.info "Begin loop through data array"
    response[:data].each do |item|
      puzzle_data = item[:puzzle_data]
      puzzle_id = puzzle_data[:id].to_i
      @logger.info "Syncing puzzle #{puzzle_id}"
      existing_puzzle = Puzzle.find_by(id: puzzle_id)
      if existing_puzzle && Date.parse(puzzle_data[:date]) == existing_puzzle.date
        @logger.info "Data for puzzle #{puzzle_id} already matches. Skipping."
        next
      end

      update_or_create_puzzle(item, existing_puzzle)
    end
    response
  end

  def sync_puzzles(starting_id = nil, page_size: 50, page_limit: nil)
    starting_id ||= Puzzle.last.id
    @logger.info "Starting with #{starting_id}"
    page_count = 0

    loop do
      @logger.info "Iterating loop"
      response = sync_puzzle_batch(starting_id, page_size:)
      raise ApiError, "Error returned: #{response[:error]}" if response[:error]

      page_count += 1
      if page_limit.is_a?(Integer) && page_count >= page_limit
        @logger.info "Page limit reached. Exiting"
        break
      end

      if response[:data].length < page_size
        @logger.info "Data length < #{page_size}. Last puzzle reached. Exiting"
        break
      end

      starting_id = result[:last_id].to_i + 1
    end
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def update_or_create_puzzle(data_hash, existing_puzzle)
    puzzle_data, origin_data, answer_words =
      data_hash.values_at(:puzzle_data, :origin_data, :answer_words)

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
    if puzzle_data[:origin_type] == "NytPuzzle"
      existing_origin = NytPuzzle.find_by(id: origin_data[:id].to_i)
      return NytPuzzle.create!(origin_data) unless existing_origin

      existing_origin.update!(origin_data)
    elsif puzzle_data[:origin_type] == "SbSolverPuzzle"
      existing_origin = SbSolverPuzzle.find_by(id: origin_data[:id].to_i)
      return SbSolverPuzzle.create!(origin_data) unless existing_origin

      existing_origin.update!(origin_data)
    else
      raise ApiError, "Invalid origin type: #{puzzle_data[:origin_type]}"
    end
  end

  def create_answers(puzzle, answer_words)
    answer_words.each do |word_data|
      text = word_data[:text]
      word = Word.create_or_find_by!(text:)
      word.update!(word_data.except(:text))
      Answer.create!({ puzzle:, word_text: text })
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

    response[:data].each do |word_hint|
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
    response[:data]
  end

  def send_instructions
    instruction_count = query_instruction_count
    instructions = OpenaiHintInstruction.offset(instruction_count).each.map(&:to_sync_api)
    return @logger.info "Instructions already fully synced. Exiting" if instructions.empty?
    path = "/instructions/sync"
    response = send_post_request(path, { instructions: })
    raise ApiError, "Error sending instructions: #{response[:error]}" if response[:error]
    @logger.info "Instructions sent successfully: #{response[:success]}"
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def send_openai_log_request(requests_offset, responses_offset)
    valid_type!(requests_offset, Integer, ->(p) { !p.negative? })
    valid_type!(responses_offset, Integer, ->(p) { !p.negative? })
    path = "/openai_logs?requests_offset=#{requests_offset}&responses_offset=#{responses_offset}"
    response = send_get_request(path)
    response[:data]
  end

  def sync_openai_log_batch
    requests_offset = OpenaiHintRequest.count
    responses_offset = OpenaiHintResponse.count
    @logger.info "Starting batch. Page size: 100 each, requests_offset: #{requests_offset}, "\
      "responses_offset: #{responses_offset}"
    result = send_openai_log_request(requests_offset, responses_offset)
    OpenaiHintRequest.insert_all!(result[:requests])
    OpenaiHintResponse.insert_all!(result[:responses])
    requests_count = result[:requests].length
    responses_count = result[:responses].length
    @logger.info "Batch complete. requests_count: #{requests_count}, responses_count: "\
      "#{responses_count}"
    { requests_count:, responses_count: }
  end

  def sync_openai_logs
    @logger.info "Starting OpenAI API request and response sync..."
    loop do
      result = sync_openai_log_batch
      if result[:requests_count] < 100 && result[:responses_count] < 100
        @logger.info "All records synced. Exiting"
        break
      end
    end
  end

  def logger=(value)
    @logger =
      if value.is_a?(ContextualLogger)
        value
      else
        ContextualLogger.new("log/sync_api.log", "weekly",
          global_puts_and: [:unknown, :fatal, :error, :warn, :info],)
      end
    @validator&.logger = value
  end

  def validator=(value)
    @validator =
      if value.is_a?(Validator)
        value
      else
        Validator.new(@logger)
      end
  end
end
