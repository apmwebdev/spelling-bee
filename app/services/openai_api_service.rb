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

##
# Connects to the OpenAI API to generate word definition hints
class OpenaiApiService
  # Default limit for the number of words per request to get hints for. This number is based on the
  # limits of the model being used, which is `gpt-3.5-turbo-0125`. This model has 3 limits:
  # 1. 250,000 tokens per minute
  # 2. 3,000 requests per minute
  # 3. 4,096 tokens per response
  # Of these, the 4k tokens/response is the most limiting. With a word limit of 140, each response
  # should be ~3k tokens, falling well under the limit with some wiggle room.
  REQUEST_WORD_LIMIT = 140

  # After tokens/response, the next most limiting factor is tokens/minute. With the input tokens and
  # response tokens, each request + response cycle should be ~3600 tokens. With 60 requests, that
  # would be ~216,000 tokens. Because the requests are not being batched and each request takes
  # several seconds, however, there's no way the TPM limit should ever be reached.
  RPM_LIMIT = 60

  # Character limit for the stringified request content. This prevents accidentally sending a
  # massive request (for whatever reason). Nearly all of the token length of a request is taken up
  # here. With a word limit of 140 words, the content length should be ~2000 characters.
  CONTENT_CHAR_LIMIT = 3000

  # Which AI model to use for requests. The different models are listed here:
  # https://platform.openai.com/docs/models/models
  # The limits for the different models are shown here: https://platform.openai.com/account/limits
  DEFAULT_AI_MODEL = "gpt-3.5-turbo-0125"

  def initialize
    @logger = ContextualLogger.new("log/open_ai_api.log", "weekly")
    @validator = OpenaiApiValidator.new(@logger)
  end

  ##
  # A data object to both a) pass data to methods that will turn that data into an API request, and
  # b) hold state data for recursive functions so that they know when to stop execution. An existing
  # state_data object can be splatted in, or fields can be set individually while the rest remain as
  # their default values, or no arguments can be given so that the default status_data object is
  # returned. Note that word_set is always created fresh.
  def create_fresh_state_data(puzzle_id: nil, word_limit: nil, rpm_limit: nil, request_count: nil,
                              batch_limit: 0, batch_count: 0, **_others)
    {
      puzzle_id: puzzle_id.is_a?(Integer) && puzzle_id.positive? ? puzzle_id : 1,
      word_limit: word_limit.is_a?(Integer) && word_limit.positive? ? word_limit : REQUEST_WORD_LIMIT,
      rpm_limit: rpm_limit.is_a?(Integer) && rpm_limit.positive? ? rpm_limit : RPM_LIMIT,
      request_count: request_count.is_a?(Integer) && !request_count.negative? ? request_count : 0,
      batch_limit: batch_limit.is_a?(Integer) && batch_limit.positive? ? batch_limit : 0,
      batch_count: batch_count.is_a?(Integer) && batch_count.positive? ? batch_count : 0,
      word_set: Set.new,
    }
  end

  ##
  # Pass in content and send a request to the OpenAI API with it. Return the response.
  # @param content [String] The text the AI should respond to.
  # @param return_json [Boolean] When true, adds a property to the request body instructing the API
  #   to return a response that is a valid JSON string. The format of this JSON needs to be
  #   specified in `content`.
  # @param ai_model [String, NilClass] The AI model to use. If this param is not a string (which it
  #   isn't by default), the request will use the DEFAULT_AI_MODEL constant defined above.
  # @return Net::HTTPResponse | NilClass
  def send_request(content, return_json: true, ai_model: nil)
    @logger.debug "content = #{content}"
    raise TypeError, "Invalid content" if !content.is_a?(String) || content == ""

    # If the content length is greater than the character limit, something went wrong. Abort.
    raise TypeError, "Content is too long" if content.length > CONTENT_CHAR_LIMIT

    uri = URI.parse("https://api.openai.com/v1/chat/completions")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 120

    request = Net::HTTP::Post.new(uri)
    request.content_type = "application/json"
    request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
    request_body = {
      model: ai_model.is_a?(String) ? ai_model : DEFAULT_AI_MODEL,
      messages: [
        {
          role: "user",
          content:,
        },
      ],
    }
    request_body[:response_format] = { type: "json_object" } if return_json
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
    @logger.debug("Response received, turnaround time = #{response_time} seconds",
      puts_only: true,)

    { response:, response_time: }
  end

  ##
  # Recursively build an answer list (as a Set, later converted to an array) to send to the API for
  # hints. Wrap word data in state data to allow for recursion and batching.
  def generate_word_data(state_data)
    unless @validator.valid_state_data?(state_data)
      raise TypeError, "Invalid state_data: #{state_data}"
    end

    if state_data[:word_set].size >= state_data[:word_limit]
      @logger.info "Word list size limit reached. Exiting"
      return state_data
    end

    # Get all words for the given puzzle ID
    words = Word.joins(:puzzles).where(puzzles: { id: state_data[:puzzle_id] }).order(:text)
    # If words is empty, that means we've gone past the last puzzle and we're done.
    if words.empty?
      @logger.info "Words not found for puzzle ID #{state_data[:puzzle_id]}. Exiting"
      return state_data
    end

    words.each do |word|
      if state_data[:word_set].size >= state_data[:word_limit]
        @logger.info "Word list size limit reached. Exiting"
        return state_data
      end

      # Only get a hint for a word once
      unless word.hint.nil?
        @logger.debug "Hint already exists for \"#{word.text}\". Skipping"
        next
      end

      @logger.debug "Adding \"#{word.text}\" to word set"
      state_data[:word_set].add(word.text)
    end
    state_data[:puzzle_id] = state_data[:puzzle_id] + 1

    generate_word_data(state_data)
  end

  ##
  # Generate the content for the message sent to the OpenAI API. Combine the static instructions
  # with a dynamically generated word list get to get hints for.
  def generate_message_content(state_data_with_words, instructions)
    unless @validator.valid_state_data_with_words?(state_data_with_words)
      raise TypeError, "state_data_with_words is invalid: #{state_data_with_words}"
    end

    unless instructions.is_a?(OpenaiHintInstruction)
      raise TypeError, "instructions must be an OpenaiHintInstruction: #{instructions}"
    end

    word_list_string = "#{data[:word_set].to_a.join(', ')}\n"

    "#{instructions.pre_word_list_text} #{word_list_string} #{instructions.post_word_list_text}"
  end

  ##
  # Save a hint for a word
  def add_hint_to_word(word_hint)
    raise TypeError, "Invalid word hint: #{word_hint}" unless @validator.valid_word_hint?(word_hint)

    word = Word.find(word_hint[:word])
    word.hint = word_hint[:hint]
    word.save!
  end

  ##
  # Loop through a word_hints array and save all the hints. This is in its own method so it's more
  # easily testable.
  def save_hints(word_hints)
    raise TypeError, "word_hints isn't an array: #{word_hints}" unless word_hints.is_a?(Array)

    @logger.debug "word_hints length is #{word_hints.length}"
    word_hints.each do |word_hint|
      add_hint_to_word(word_hint)
    end
  end

  def extract_headers(response)
    raise TypeError, "Invalid response" unless response.is_a?(Net::HTTPResponse)

    required_headers = [
      "openai-processing-ms",
      "openai-version",
      "x-ratelimit-limit-requests",
      "x-ratelimit-limit-tokens",
      "x-ratelimit-remaining-requests",
      "x-ratelimit-remaining-tokens",
      "x-ratelimit-reset-requests",
      "x-ratelimit-reset-tokens",
      "x-request-id",
    ]
    response.to_hash.slice(*required_headers)
  end

  def save_hint_request(state_data, instructions, ai_model)
    request_record = OpenaiHintRequest.new
    request_record.openai_hint_instruction = instructions
    request_record.word_list = state_data[:word_set].to_a
    request_record.req_ai_model = ai_model.is_a?(String) ? ai_model : DEFAULT_AI_MODEL
    request_record.save!
    request_record
  end

  def save_hint_response(parsed_response, request)
    is_successful_parsed_response = @validator.successful_parsed_response?(parsed_response)
    is_error_parsed_response = @validator.error_parsed_response?(parsed_response)

    unless is_successful_parsed_response || is_error_parsed_response
      raise TypeError, "Invalid parsed_response: #{parsed_response}"
    end

    # Basic data: Necessary and always present
    record = OpenaiHintResponse.new
    record.openai_hint_request = request
    record.word_hints = parsed_response[:word_hints] if is_successful_parsed_response
    record.error_body = parsed_response[:error_body] if is_error_parsed_response
    record.http_status = parsed_response[:http_status]
    record.response_time_seconds = parsed_response[:response_time].round(3)

    # Metadata from response body: Should be present, but save anyway if missing some or all
    meta = parsed_response[:body_meta]
    record.chat_completion_id = meta[:id]
    record.system_fingerprint = meta[:system_fingerprint]
    record.openai_created_timestamp = meta[:created]
    record.res_ai_model = meta[:model]
    if meta[:usage]
      record.prompt_tokens = meta[:usage][:prompt_tokens]
      record.completion_tokens = meta[:usage][:completion_tokens]
      record.total_tokens = meta[:usage][:total_tokens]
    end

    # Headers: Should be present, but save anyway if missing some or all
    headers = parsed_response[:headers]
    record.openai_processing_ms = headers["openai-processing-ms"]
    record.openai_version = headers["openai-version"]
    record.x_ratelimit_limit_requests = headers["x-ratelimit-limit_requests"]
    record.x_ratelimit_limit_tokens = headers["x-ratelimit-limit-tokens"]
    record.x_ratelimit_remaining_requests = headers["x-ratelimit-remaining-requests"]
    record.x_ratelimit_remaining_tokens = headers["x-ratelimit-remaining-tokens"]
    record.x_ratelimit_reset_requests = headers["x-ratelimit-reset-requests"]
    record.x_ratelimit_reset_tokens = headers["x-ratelimit-reset-tokens"]
    record.x_request_id = headers["x-request-id"]

    record.save!
  end

  ##
  # Take an OpenAI API response and return the relevant data from it.
  def parse_response(wrapped_response)
    unless @validator.valid_wrapped_response?(wrapped_response)
      raise TypeError, "Invalid wrapped response"
    end

    response = wrapped_response[:response]
    headers = extract_headers(response)
    http_status = response.code.to_i
    response_time = wrapped_response[:response_time]

    begin
      parsed_body = JSON.parse(response.body, symbolize_names: true)
    rescue JSON::ParserError, TypeError => e
      raise TypeError, "JSON.parse(response.body) failed: #{e.message}. body = #{body}"
    end

    body_meta = parsed_body.exclude(:choices)
    return_hash = { body_meta:, headers:, http_status:, response_time: }

    # Make sure the response body has [:choices][0][:message][:content][:word_hints]
    if @validator.valid_response_body_content?(parsed_body)
      content = JSON.parse(parsed_body[:choices][0][:message][:content], symbolize_names: true)
      return_hash[:word_hints] = content[:word_hints]
      return return_hash
    end

    return_hash[:error_body] = parsed_body
    return return_hash
  end

  ##
  # Takes state data, generates a word hint request, sends it, and returns the response.
  # Re-raises exceptions after logging them
  def process_hint_request(state_data, instructions: nil, ai_model: nil)
    unless @validator.valid_state_data_with_words?(state_data)
      raise TypeError, "State data is invalid: #{state_data}"
    end

    instructions = if instructions.is_a?(OpenaiHintInstruction)
                     instructions
                   else
                     OpenaiHintInstruction.last
                   end
    ai_model = ai_model.is_a?(String) ? ai_model : DEFAULT_AI_MODEL

    message_content = generate_message_content(state_data, instructions)
    request_record = save_hint_request(state_data, instructions, ai_model)

    wrapped_response = send_request(message_content, ai_model:)
    parsed_response = parse_response(wrapped_response)

    save_hint_response(parsed_response, request_record)

    return parsed_response
  end

  ##
  # Loop through the answers in batches and fetch hints for each one that doesn't already have a
  # hint, saving them to the database.
  def seed_answer_hints(state_data, with_save: true)
    @logger.info "Starting iteration. state_data = #{state_data}"
    if state_data[:batch_limit].positive? && state_data[:batch_count] >= state_data[:batch_limit]
      @logger.info "Batch limit reached. Exiting"
      return
    end

    state_data_with_words = generate_word_data(state_data)
    unless @validator.valid_state_data_with_words?(state_data_with_words)
      raise TypeError, "Invalid state_data_with_words: #{state_data_with_words}"
    end

    # Set a cool down after a certain number of requests to avoid hitting the rate limit.
    # Theoretically, you could use the response headers to determine exactly when and for how long
    # the cool down should be, but, again, this is largely a moot point since it's doubtful the
    # request rate limit will even be reached once. The rate limit headers are detailed here:
    # https://platform.openai.com/docs/guides/rate-limits/rate-limits-in-headers
    if state_data_with_words[:request_count] >= state_data_with_words[:rpm_limit]
      sleep(60)
      state_data_with_words[:request_count] = 0
    end

    wrapped_response = process_hint_request(state_data_with_words)
    word_hints = parse_response(wrapped_response)
    state_data_with_words[:request_count] += 1
    # Only track the batch count if there's a batch limit
    state_data_with_words[:batch_count] += 1 if state_data_with_words[:batch_limit].positive?
    if with_save
      save_hints(word_hints)
    else
      @logger.debug "Parsed word hints: #{word_hints}"
    end
    # If the maximum number of words have been retrieved, run this function again starting from
    # where the previous iteration left off. If word_set.length != word_limit, it must be smaller.
    # The only way it can be smaller is if there are no more answers to get hints for. In that
    # case, return nothing.
    return unless state_data_with_words[:word_set].length == state_data_with_words[:word_limit]

    return seed_answer_hints(create_fresh_state_data(**state_data_with_words), with_save:)
  rescue TypeError => e
    @logger.exception(e, :fatal)
  end

  ##
  # Test if it's possible to connect to the OpenAI API with the given URL, key, and request format.
  def test_connection
    wrapped_response = send_request("What is OpenAI?", return_json: false)
    response = wrapped_response[:response]
    puts response.body if response
  end

  def test_hash_response
    wrapped_response = send_request("What is OpenAI?", return_json: false)
    response = wrapped_response[:response]
    puts response.to_hash if response
  end

  ##
  # Test sending a hint request and parsing the response, but not saving it.
  def test_request(word_limit)
    starting_state_data = create_fresh_state_data(word_limit: word_limit.to_i)
    state_data = generate_word_data(starting_state_data)
    @logger.debug state_data

    message_content = generate_message_content(state_data, OpenaiHintInstruction.last)
    @logger.debug message_content

    wrapped_response = send_request(message_content)
    response = wrapped_response[:response]
    unless response
      @logger.fatal "No response"
      return
    end
    @logger.debug "Response body: #{response.body}"

    word_hints = parse_response(response)
    @logger.debug "Word hints: #{word_hints}"

    word_hints
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  ##
  # Test sending a hint request, parsing the response, and saving the hints. This doesn't test the
  # batching logic.
  def test_request_and_save(word_limit = nil)
    word_hints = test_request(word_limit.to_i)
    save_hints(word_hints) if word_hints
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def test_batching(word_limit, batch_limit)
    state_data = create_fresh_state_data(word_limit: word_limit.to_i, batch_limit: batch_limit.to_i)
    @logger.debug(state_data, puts_only: true)
    seed_answer_hints(state_data, with_save: true)
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end
end
