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

# Validator for the OpenAI API
class OpenaiApiValidator < ExternalServiceValidatorBase
  # Validates the object that holds the word list and state data
  def valid_state_data?(hash)
    hash_properties_are_valid?(hash, display_name: "state_data", props: [
      [:puzzle_id, Integer, ->(p) { p.positive? }],
      [:word_limit, Integer, ->(p) { p.positive? }],
      [:word_set, Set],
      [:rpm_limit, Integer, ->(p) { p.positive? }],
      [:request_count, Integer, ->(p) { !p.negative? }],
      [:batch_limit, Integer, ->(p) { !p.negative? }],
      [:batch_count, Integer, ->(p) { !p.negative? }],
    ],)
  end

  def valid_state_data_with_words?(hash)
    return false unless valid_state_data?(hash)
    raise TypeError, "Word set is empty" unless hash[:word_set].length.positive?
    return true
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_word_hint?(json)
    hash_properties_are_valid?(json, display_name: "word hint", props: [
      [:word, String],
      [:hint, String],
    ],)
  end

  def valid_wrapped_response?(wrapped_response)
    hash_properties_are_valid?(wrapped_response, display_name: "wrapped response", props: [
      [:response_time, Float],
      [:response, Net::HTTPResponse],
    ],)
  end

  def valid_hint_response?(response)
    raise TypeError, "Not an HTTP success response" unless response.is_a?(Net::HTTPSuccess)

    begin
      parsed_body = JSON.parse(response.body, symbolize_names: true)
    rescue JSON::ParserError, TypeError => e
      raise TypeError, "Body is invalid JSON: #{e.message}. body = #{body}"
    end

    return false unless valid_response_body?(parsed_body)
    valid_headers?(response)
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_headers?(response)
    raise TypeError, "Not an HTTPResponse" unless response.is_a?(Net::HTTPResponse)

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
    raise TypeError, "Missing required headers" unless keys?(required_headers, response.to_hash)
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_response_body_meta?(json)
    hash_properties_are_valid?(json, display_name: "response body", props: [
      [:id, String],
      [:created, Integer],
      [:model, String],
      [:usage, Hash, ->(p) { valid_usage_data?(p) }],
      [:system_fingerprint, String],
    ],)
  end

  def valid_usage_data?(json)
    hash_properties_are_valid?(json, display_name: "usage data", props: [
      [:prompt_tokens, Integer],
      [:completion_token, Integer],
      [:total_tokens, Integer],
    ],)
  end

  def valid_response_body_content?(json)
    hash_properties_are_valid?(json, display_name: "response content", props: [
      [:choices, Array, ->(p) { valid_response_word_hints?(p) }],
    ],)
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
