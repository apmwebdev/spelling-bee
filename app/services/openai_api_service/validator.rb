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
  # Validator for the OpenAI API
  class Validator < ExternalServiceValidatorBase
    include Constants

    def full_word_list?(word_list)
      valid_type?(word_list, WordList, ->(p) { p.word_set.length.positive? }, should_raise: true)
    end

    def valid_word_hint?(json)
      valid_hash?(json, [
        [:word, String, ->(p) { p.length.positive? }],
        [:hint, String, ->(p) { p.length.positive? }],
      ], display_name: "word_hint", should_raise: true,)
    end

    def valid_word_hints?(array)
      array.all? { |hash| valid_word_hint?(hash) }
    end

    def valid_wrapped_response?(wrapped_response)
      valid_hash?(wrapped_response, [
        [:response_time, Float],
        [:response, Net::HTTPResponse],
      ], display_name: "wrapped_response",)
    end

    def valid_response_body?(body)
      parsed_body = JSON.parse(body, symbolize_names: true)
      raise TypeError, "Invalid body meta" unless valid_response_body_meta?(parsed_body)
      raise TypeError, "No content" unless parsed_body.dig(:choices, 0, :message, :content)
      return true
    rescue StandardError => e
      @logger.exception e
      return false
    end

    def valid_response_body_meta?(json)
      valid_hash?(json, [
        [:id, String],
        [:created, Integer],
        [:model, String],
        [:usage, Hash, ->(p) { valid_usage_data?(p) }],
        [:system_fingerprint, String],
      ], display_name: "response_body",)
    end

    def valid_usage_data?(json)
      valid_hash?(json, [
        [:prompt_tokens, Integer],
        [:completion_tokens, Integer],
        [:total_tokens, Integer],
      ], display_name: "usage",)
    end

    ##
    # @param [Net::HTTPResponse] response
    def expected_response_headers?(response)
      normalized_headers = response.to_hash.transform_keys(&:downcase)
      EXPECTED_HEADERS.each do |key|
        raise TypeError, "Missing header '#{key}'" unless normalized_headers.key?(key)
      end
      return true
    rescue TypeError => e
      @logger.exception e
    end

    def valid_response_body_content?(json)
      valid_hash?(json, [
        [:choices, Array, ->(p) { valid_response_word_hints?(p) }],
      ], display_name: "content",)
    end

    def valid_response_word_hints?(json)
      raise TypeError, "json isn't an array: #{json}" unless json.is_a?(Array)

      raise TypeError, "json is empty: #{json}" if json.empty?

      first_choice = json.first
      unless first_choice.is_a?(Hash)
        raise TypeError, "First 'choices' item isn't a hash: #{first_choice}"
      end

      unless first_choice.key?(:message)
        msg = "First choice is invalid: No ':message' key. First choice = #{first_choice}"
        raise TypeError, msg
      end

      message = first_choice[:message]
      unless message.key?(:content)
        raise TypeError, "Message is invalid: No ':content' key. Message = #{message}"
      end

      content_string = message[:content]
      begin
        content = JSON.parse(content_string, symbolize_names: true)
      rescue JSON::ParserError, TypeError => e
        raise TypeError, "JSON parsing of content failed: #{e.message} content = #{content_string}"
      end

      unless content.key?(:word_hints)
        raise TypeError, "Content is invalid: No ':word_hints' key. content = #{content}"
      end

      word_hints = content[:word_hints]
      raise TypeError, "word_hints isn't an array: #{word_hints}" unless word_hints.is_a?(Array)

      if word_hints.any? { |hint| !valid_word_hint?(hint) }
        raise TypeError, "Some word hints are invalid: #{word_hints}"
      end

      return true
    rescue TypeError => e
      @logger.exception e
      return false
    end
  end
end
