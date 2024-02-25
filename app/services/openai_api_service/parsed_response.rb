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
  ##
  # Holds parsed data from an API response (e.g., word list, headers, etc.)
  class ParsedResponse
    include BasicValidator
    include Constants
    include Loggable

    attr_reader :logger, :validator, :raw_response, :body_meta, :headers, :http_status,
      :response_time_seconds, :word_hints, :error_body

    def initialize(logger, validator, wrapped_response)
      self.logger = logger
      self.validator = validator
      parse(wrapped_response)
    end

    ##
    # Take a wrapped response object and parse it out into the relevant parts
    def parse(wrapped_response)
      unless @validator.valid_wrapped_response?(wrapped_response)
        raise TypeError, "Invalid wrapped response: #{wrapped_response}"
      end

      response = wrapped_response[:response]
      @raw_response = wrapped_response[:response]
      @headers = extract_headers(response)
      @http_status = response.code.to_i
      self.response_time_seconds = wrapped_response[:response_time]

      begin
        parsed_body = JSON.parse(response.body, symbolize_names: true)
      rescue JSON::ParserError, TypeError => e
        raise TypeError, "JSON.parse(response.body) failed: #{e.message}. body = #{body}"
      end

      self.body_meta = parsed_body.except(:choices)
      parse_and_set_content(parsed_body)
    end

    def parse_and_set_content(parsed_body)
      if @validator.valid_response_body_content?(parsed_body)
        content = JSON.parse(parsed_body[:choices][0][:message][:content], symbolize_names: true)
        @word_hints = content[:word_hints]
      else
        @error_body = parsed_body
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
      if value.is_a?(ContextualLogger)
        @logger = value
      else
        @logger ||= ContextualLogger.new("log/open_ai_api.log", "weekly")
        @logger.error "@logger must be a ContextualLogger. Passed #{value}"
      end
    end

    def validator=(value)
      if value.is_a?(Validator)
        @validator = value
      else
        @validator ||= Validator.new(@logger)
        @logger.error "@validator must be a Validator. Passed #{value}"
      end
    end

    ##
    # Log, but do not raise, an error if body_meta is invalid. This shouldn't prevent the
    # response from being saved.
    def body_meta=(value)
      if @validator.valid_response_body_meta?(value)
        @body_meta = value
      else
        @logger.error "Invalid body_meta: #{value}"
      end
    end

    ##
    # Extract the relevant, non-sensitive headers for storing in the DB
    # @raise [TypeError]
    def extract_headers(response)
      raise TypeError, "Invalid response" unless response.is_a?(Net::HTTPResponse)
      response
        .to_hash # Turns response into a hash with headers as entries
        .transform_keys(&:downcase) # Normalize keys before extracting relevant headers
        .slice(*RELEVANT_HEADERS) # Extract relevant headers
        .transform_values(&:first) # Each value is wrapped in an array; get just the value
    end
  end
end
