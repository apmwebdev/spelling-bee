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

  def valid_response_body?(json)
    raise TypeError, "json isn't a hash: #{json}" unless json.is_a?(Hash)

    # This and subsequent methods assume string keys have been converted to symbols
    raise TypeError, "json has no key ':choices': #{json}" unless json.key?(:choices)

    unless json[:choices].is_a?(Array)
      raise TypeError, "json[:choices] isn't an array: #{json[:choices]}"
    end

    raise TypeError, "json[:choices] is empty: #{json[:choices]}" if json[:choices].empty?

    first_choice = json[:choices].first
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
