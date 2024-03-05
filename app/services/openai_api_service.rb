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

require "net/http"
require "uri"
require "json"

# Connects to the OpenAI API to generate word definition hints
class OpenaiApiService
  include Constants
  include Messages
  include BasicValidator

  OPENAI_API_KEY = ENV["OPENAI_API_KEY"]

  attr_reader :logger, :validator, :word_limit, :request_cap

  def initialize(logger: nil, validator: nil, word_limit: nil, request_cap: nil)
    @logger =
      if class_or_double?(logger, ContextualLogger)
        @logger = logger
      elsif Rails.env.test?
        ContextualLogger.new(IO::NULL)
      else
        ContextualLogger.new("log/open_ai_api.log", "weekly")
      end
    @validator =
      if class_or_double?(validator, Validator)
        validator
      else
        Validator.new(@logger)
      end
    @word_limit = word_limit || DEFAULT_WORD_LIMIT
    @request_cap = request_cap
  end

  # Pass in content and send a request to the OpenAI API with it. Return the response.
  # @param content [String] The text the AI should respond to.
  # @param format_as_json [Boolean] When true, adds a property to the request body instructing the
  #   API to return a response that is a valid JSON string. The format of this JSON needs to be
  #   specified in `content`.
  # @param ai_model [String, nil] The AI model to use. If this param is not a string (which it
  #   isn't by default), the request will use the DEFAULT_AI_MODEL constant defined above.
  # @raise [TypeError]
  # @return Hash
  def send_request(content, format_as_json: true, ai_model: nil)
    raise TypeError, "Invalid content" if !content.is_a?(String) || content == ""

    # If the content length is greater than the character limit, something went wrong. Abort.
    raise TypeError, "Content is too long" if content.length > CONTENT_CHAR_LIMIT

    uri = URI.parse("https://api.openai.com/v1/chat/completions")
    http = Net::HTTP.new(uri.host || "", uri.port)
    http.use_ssl = true
    http.read_timeout = 120

    request = Net::HTTP::Post.new(uri)
    request.content_type = "application/json"
    request["Authorization"] = "Bearer #{OPENAI_API_KEY}"
    request_body = {
      model: ai_model.is_a?(String) ? ai_model : DEFAULT_AI_MODEL,
      messages: [
        {
          role: "user",
          content:,
        },
      ],
    }
    request_body[:response_format] = { type: "json_object" } if format_as_json
    request.body = JSON.dump(request_body)

    before_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    begin
      response = http.request(request)
    rescue Net::ReadTimeout => e
      @logger.error "Request timed out: #{e.message}"
      response = nil
    end
    after_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    response_time = (after_time - before_time)

    { response:, response_time: }
  end

  # Recursively build an answer list (as a Set, later converted to an array) to send to the API for
  # hints.
  # @param word_list [WordList]
  def generate_word_data(word_list = WordList.new)
    valid_type!(word_list, WordList)

    if word_list.word_set.length >= @word_limit
      word_list.log_message = WORD_LIST_FULL_FRESH
      return word_list
    end

    # Get all words for the given puzzle ID
    puzzle_words = Word.joins(:puzzles).where(puzzles: { id: word_list.puzzle_id }).order(:text)
    # If words is empty, that means we've gone past the last puzzle and we're done.
    if puzzle_words.empty?
      word_list.log_message = PUZZLE_WORDS_EMPTY
      return word_list
    end

    puzzle_words.each do |word|
      if word_list.word_set.length >= @word_limit
        word_list.log_message = WORD_LIST_FULL
        return word_list
      end

      # Only get a hint for a word once
      unless word.hint.nil?
        @logger.debug "Hint already exists for \"#{word.text}\". Skipping"
        next
      end

      @logger.debug "Adding \"#{word.text}\" to word set"
      word_list.word_set.add(word.text)
    end
    word_list.puzzle_id += 1

    generate_word_data(word_list)
  end

  # Generate the content for the message sent to the OpenAI API. Combine the static instructions
  # with a dynamically generated word list get to get hints for.
  # @param word_list [WordList]
  # @param instructions [OpenaiHintInstruction]
  # @raise [TypeError]
  # @return [String]
  def generate_message_content(word_list, instructions)
    @validator.full_word_list!(word_list)
    valid_type!(instructions, OpenaiHintInstruction)

    word_list_string = "#{word_list.word_set.to_a.join(', ')}\n"

    "#{instructions.pre_word_list_text} #{word_list_string} #{instructions.post_word_list_text}"
  end

  # Save a hint for a word
  # @param word_hint [Hash]
  # @raise [TypeError, ActiveRecord::RecordNotFound, ActiveRecord::RecordInvalid]
  def save_hint(word_hint)
    @validator.valid_word_hint!(word_hint)

    word = Word.find(word_hint[:word])
    word.hint = word_hint[:hint]
    word.save!
  end

  # Loop through a word_hints array and save all the hints. This is in its own method so it's more
  # easily testable.
  # @param word_hints [Array<Hash>]
  # @raise [TypeError]
  def save_hints(word_hints)
    @validator.valid_word_hints!(word_hints)

    @logger.info Messages.save_hints_length(word_hints.length)
    word_hints.each do |word_hint|
      save_hint(word_hint)
    end
    @logger.info "Finished saving word hints"
  end

  # Assumes that type checking/validation was already performed
  # @param word_list [WordList]
  # @param instructions [OpenaiHintInstruction]
  # @param ai_model [String]
  #
  # @raise [TypeError, ActiveRecord::RecordInvalid]
  # @return OpenaiHintRequest
  def save_hint_request(word_list, instructions, ai_model)
    @validator.full_word_list!(word_list)
    valid_type!(instructions, OpenaiHintInstruction)
    valid_type!(ai_model, String)

    request_record = OpenaiHintRequest.new
    request_record.openai_hint_instruction = instructions
    request_record.word_list = word_list.word_set.to_a
    request_record.req_ai_model = ai_model
    request_record.save!
    @logger.info Messages::SAVE_HINT_REQUEST_SUCCESS
    # Return the newly saved record so that it can be properly linked to the response that comes
    # back
    request_record
  end

  # @param parsed_response [ParsedResponse]
  # @param request [OpenaiHintRequest]
  # @raise [TypeError, ActiveRecord::RecordInvalid]
  def save_hint_response(parsed_response, request)
    valid_type!(parsed_response, ParsedResponse)

    # Basic data: Necessary and always present
    record = OpenaiHintResponse.new
    record.openai_hint_request = request
    record.word_hints = parsed_response.word_hints
    record.error_body = parsed_response.error_body
    record.http_status = parsed_response.http_status
    record.response_time_seconds = parsed_response.response_time_seconds

    # Metadata from response body: Should be present, but save anyway if missing some or all
    meta = parsed_response.body_meta
    record.chat_completion_id = meta[:id]
    record.system_fingerprint = meta[:system_fingerprint]
    record.openai_created_timestamp = Time.at(meta[:created]).utc
    record.res_ai_model = meta[:model]
    if meta[:usage]
      record.prompt_tokens = meta[:usage][:prompt_tokens]
      record.completion_tokens = meta[:usage][:completion_tokens]
      record.total_tokens = meta[:usage][:total_tokens]
    end

    # Headers: Should be present, but save anyway if missing some or all
    headers = parsed_response.headers
    record.openai_processing_ms = headers["openai-processing-ms"]
    record.openai_version = headers["openai-version"]
    record.x_ratelimit_limit_requests = headers["x-ratelimit-limit-requests"]
    record.x_ratelimit_limit_tokens = headers["x-ratelimit-limit-tokens"]
    record.x_ratelimit_remaining_requests = headers["x-ratelimit-remaining-requests"]
    record.x_ratelimit_remaining_tokens = headers["x-ratelimit-remaining-tokens"]
    record.x_ratelimit_reset_requests = headers["x-ratelimit-reset-requests"]
    record.x_ratelimit_reset_tokens = headers["x-ratelimit-reset-tokens"]
    record.x_request_id = headers["x-request-id"]

    record.save!
    @logger.info "Hint response saved successfully"
  end

  # Takes word list, generates a word hint request, saves it, sends it, gets the response,
  # parses it, saves it, returns the response.
  def log_and_send_request(word_list, instructions: nil, ai_model: nil)
    @validator.full_word_list!(word_list)
    valid_type!(instructions, [OpenaiHintInstruction, NilClass])
    valid_type!(ai_model, [String, NilClass])

    instructions =
      if instructions.is_a?(OpenaiHintInstruction)
        instructions
      elsif instructions.nil?
        OpenaiHintInstruction.last
      end
    ai_model = ai_model.is_a?(String) ? ai_model : DEFAULT_AI_MODEL
    message_content = generate_message_content(word_list, instructions)
    request_record = save_hint_request(word_list, instructions, ai_model)

    wrapped_response = send_request(message_content, ai_model:)
    parsed_response = ParsedResponse.new(@logger, @validator, wrapped_response)

    save_hint_response(parsed_response, request_record)

    parsed_response
  end

  # @return void
  def throttle_batch(batch_state)
    remaining_requests = batch_state.remaining_requests
    reset_requests_s = batch_state.reset_requests_s
    remaining_tokens = batch_state.remaining_tokens
    reset_tokens_s = batch_state.reset_tokens_s

    if remaining_requests == 0
      @logger.warn "remaining_requests == 0. Sleeping for #{reset_requests_s} seconds"
      sleep(reset_requests_s)
      batch_state.reset_tokens_s =
        if reset_tokens_s.nil? || reset_requests_s > reset_tokens_s
          0
        else
          reset_tokens_s - reset_requests_s
        end
      batch_state.retry_count = 0
    end

    if reset_tokens_s&.positive? &&
       remaining_tokens.is_a?(Integer) &&
       remaining_tokens < MINIMUM_REMAINING_TOKENS

      @logger.warn "remaining_tokens too low. Minimum needed to send request is "\
        "#{MINIMUM_REMAINING_TOKENS}, current value is "\
        "#{batch_state.remaining_tokens}. Sleeping for #{batch_state.reset_tokens_s} "\
        "seconds."
      sleep(batch_state.reset_tokens_s)
      batch_state.retry_count = 0
    end
  end

  # Loop through the answers in batches and fetch hints for each one that doesn't already have a
  # hint, saving them to the database.
  # @return void
  def fetch_hints(batch_state, puzzle_id: 1, with_save: true)
    valid_type!(batch_state, BatchState, display_name: "batch_state")
    valid_type!(puzzle_id, Integer, ->(p) { p.positive? }, display_name: "puzzle_id")
    valid_type!(with_save, Boolean, display_name: "with_save")

    @logger.info fetch_hints_start(batch_state)

    if @request_cap.is_a?(Integer) && batch_state.request_count >= @request_cap
      @logger.info FETCH_HINTS_REQUEST_CAPPED
      return
    end

    word_list = generate_word_data(WordList.new(puzzle_id))
    unless @validator.full_word_list?(word_list)
      logger.info FETCH_HINTS_EMPTY_WORD_LIST
      return
    end

    new_puzzle_id = word_list.puzzle_id
    throttle_batch(batch_state)
    parsed_response = log_and_send_request(word_list)
    batch_state.update_from_response(parsed_response)
    if parsed_response.word_hints
      @logger.info FETCH_HINTS_SUCCESSFUL_RESPONSE
      batch_state.retry_count = 0
      if with_save
        save_hints(parsed_response.word_hints)
      else
        @logger.debug "Parsed word hints: #{parsed_response.word_hints}"
      end
    elsif parsed_response.error_body
      @logger.error "Error response: #{parsed_response.error_body}"
      if parsed_response.http_status == 429
        batch_state.retry_count += 1
        sleep(batch_state.sleep_time_from_retry_count)
        return fetch_hints(batch_state, puzzle_id: new_puzzle_id, with_save:)
      end
    else
      raise TypeError, "Something went wrong with the response. Both word_hints and error_body "\
        "are nil. parsed_response: #{parsed_response}"
    end
    # If the maximum number of words have been retrieved, run this function again starting from
    # where the previous iteration left off. If word_set.length != word_limit, it must be smaller.
    # The only way it can be smaller is if there are no more answers to get hints for. In that
    # case, return nothing.
    return unless word_list.word_set.length == @word_limit

    return fetch_hints(batch_state, puzzle_id: new_puzzle_id, with_save:)
  end

  def seed_hints
    batch_state = BatchState.new(@logger)
    fetch_hints(batch_state)
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  # Test if it's possible to connect to the OpenAI API with the given URL, key, and request format.
  def test_connection
    wrapped_response = send_request("What is OpenAI?", format_as_json: false)
    response = wrapped_response[:response]
    puts response.body if response
  end

  # Test sending a hint request and parsing the response, but not saving it.
  def test_request(word_limit)
    @word_limit = word_limit
    word_list = generate_word_data
    @logger.debug "word_list: #{word_list.to_loggable_hash}"

    message_content = generate_message_content(word_list, OpenaiHintInstruction.last)
    @logger.debug "message_content: #{message_content}"

    wrapped_response = send_request(message_content)
    response = wrapped_response[:response]
    unless response
      @logger.fatal "No response"
      return
    end
    @logger.debug "Response body: #{response.body}"

    parsed_response = ParsedResponse.new(@logger, @validator, wrapped_response)
    @logger.debug "Word hints: #{parsed_response.word_hints}"

    puts parsed_response.word_hints
    parsed_response.word_hints
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  # Test sending a hint request, parsing the response, and saving the hints. This doesn't test the
  # batching logic.
  def test_request_and_save(word_limit = nil)
    word_hints = test_request(word_limit.to_i)
    save_hints(word_hints) if word_hints
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def test_batching(word_limit, request_cutoff)
    @logger.global_puts_and = true
    @word_limit = word_limit
    @request_cap = request_cutoff
    batch_state = BatchState.new(@logger)
    @logger.debug("batch_state: #{batch_state.to_loggable_hash}")
    fetch_hints(batch_state, puzzle_id: 3, with_save: false)
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end
end
