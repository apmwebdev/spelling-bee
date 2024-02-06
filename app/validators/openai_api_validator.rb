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
  # Validates the object that holds the word list to send to the API and info on where to pick back up
  def valid_state_data?(hash)
    hash_properties_are_valid?(object: hash, object_name: "answer list object", method_name: __method__, props: [
      [:puzzle_id, Integer, ->(p) { p.positive? }],
      [:word_limit, Integer, ->(p) { p.positive? }],
      [:word_set, Set],
      [:rpm_limit, Integer, ->(p) { p.positive? }],
      [:request_count, Integer, ->(p) { !p.negative? }],
      [:batch_limit, Integer, ->(p) { !p.negative? }],
      [:batch_count, Integer, ->(p) { !p.negative? }],
    ],)
  end

  def valid_word_hint?(json)
    hash_properties_are_valid?(object: json, object_name: "word hint", method_name: __method__, props: [
      [:word, String],
      [:hint, String],
    ],)
  end

  def valid_response_body?(json)
    method_logger = @logger.with_method("#{self.class.name}##{__method__}")

    unless json.is_a?(Hash)
      method_logger.fatal "json isn't a hash: #{json}"
      return false
    end

    # This and subsequent methods assume string keys have been converted to symbols
    unless json.key?(:choices)
      method_logger.fatal "json has no key ':choices': #{json}"
      return false
    end

    unless json[:choices].is_a?(Array)
      method_logger.fatal "json[:choices] isn't an array: #{json[:choices]}"
      return false
    end

    if json[:choices].empty?
      method_logger.fatal "json[:choices] is empty: #{json[:choices]}"
      return false
    end


    unless json[:choices][0].key?(:message)
      method_logger.fatal "First choice is invalid: No ':message' key. json[:choices].first = #{json[:choices].first}"
      return false
    end

    message = json[:choices][0][:message]
    unless message.key?(:content)
      method_logger.fatal "Message is invalid: No ':content' key. json[:choices][0][:message] = #{message}"
      return false
    end

    content_string = message[:content]
    begin
      content = JSON.parse(content_string, symbolize_names: true)
    rescue JSON::ParserError, TypeError => e
      method_logger.fatal "content_string is invalid JSON: #{e.message} Exiting. content_string = #{content_string}"
      return false
    end

    unless content.key?(:word_hints)
      method_logger.fatal "Content is invalid: No ':word_hints' key. content = #{content}"
      return false
    end

    word_hints = content[:word_hints]
    unless word_hints.is_a?(Array)
      method_logger.fatal "word_hints isn't an array: #{word_hints}"
      return false
    end

    if word_hints.any? { |hint| !valid_word_hint?(hint) }
      method_logger.fatal "Some word hints are invalid: #{word_hints}"
      return false
    end

    true
  end
end
