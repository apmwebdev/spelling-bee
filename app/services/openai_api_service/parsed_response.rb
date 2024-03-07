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

class OpenaiApiService
  # Holds parsed data from an API response (e.g., word list, headers, etc.)
  class ParsedResponse
    include OpenaiLogger
    include BasicValidator
    include Constants

    attr_reader :logger, :validator, :raw_response, :body_meta, :headers, :http_status,
      :response_time_seconds, :word_hints, :error_body, :finish_reason

    def initialize(logger, validator, wrapped_response)
      self.logger = logger
      self.validator = validator
      parse(wrapped_response)
    end

    # Take a wrapped response object and parse it out into the relevant parts
    def parse(wrapped_response)
      @validator.valid_wrapped_response!(wrapped_response)

      response = wrapped_response[:response]
      @raw_response = wrapped_response[:response]
      @headers = extract_headers(response)
      @http_status = response.code.to_i
      self.response_time_seconds = wrapped_response[:response_time]

      begin
        parsed_body = JSON.parse(response.body, symbolize_names: true)
      rescue JSON::ParserError, TypeError => e
        @logger.error "JSON.parse(response.body) failed: #{e.message}. body = #{response.body}"
        parsed_body = response.body
      end

      self.body_meta = parsed_body
      @finish_reason = parsed_body.dig(:choices, 0, :finish_reason)&.to_s
      parse_and_set_content(parsed_body)
    end

    # Dig to the word hints array and set @word_hints to that, if possible.
    # If the word hints array can't be found, this was an unexpected response, so use @error_body
    # instead, setting it to the entire parsed response body.
    # @param parsed_body [Hash, String] Either a hash representation of the parsed JSON response
    #   body, or just the response body itself (as a string) if it can't be parsed to JSON. The
    #   latter should theoretically never happen, as the API should always return a JSON response.
    def parse_and_set_content(parsed_body)
      if @validator.valid_response_body_content?(parsed_body)
        content = JSON.parse(parsed_body[:choices][0][:message][:content], symbolize_names: true)
        @word_hints = content[:word_hints]
      else
        @error_body = parsed_body
      end
    end

    # Extract the relevant, non-sensitive headers for storing in the DB
    # @raise [TypeError]
    def extract_headers(response)
      valid_type!(response, Net::HTTPResponse)
      response
        .to_hash # Turns response into a hash with headers as entries
        .transform_keys(&:downcase) # Normalize keys before extracting relevant headers
        .slice(*RELEVANT_HEADERS) # Extract relevant headers
        .transform_values(&:first) # Each value is wrapped in an array; get just the value
    end

    # Log, but do not raise, an error if body_meta is invalid. This shouldn't prevent the
    # response from being saved.
    def body_meta=(value)
      if @validator.valid_response_body_meta?(value)
        meta_value = value.except(:content)
        @body_meta = meta_value
      else
        @logger.error "Invalid body_meta: #{value}"
      end
    end

    def response_time_seconds=(value)
      if value.is_a?(Float)
        @response_time_seconds = value.round(3)
      else
        @logger.error "Invalid response_time_seconds: #{value}"
      end
    end

    def logger=(value)
      @logger = determine_logger(value)
    end

    def validator=(value)
      if value
        @validator = value
      else
        @validator ||= Validator.new(@logger)
        @logger.error "@validator must be a Validator or RSpec double. Passed #{value}"
      end
    end
  end
end
