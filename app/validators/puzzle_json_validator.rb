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

# Validates puzzle data from either the NYT site or Sync API
class PuzzleJsonValidator < ExternalServiceValidatorBase
  def valid_nyt_puzzle?(json)
    hash_properties_are_valid?(json, display_name: "puzzle", props: [
      ["displayDate", String, ->(p) { valid_date?(p) }],
      ["centerLetter", String, ->(p) { valid_letter?(p) }],
      ["outerLetters", Array, ->(p) { valid_outer_letters?(p) }],
      ["answers", Array, ->(p) { valid_word_array?(p) }],
    ],)
  end

  def valid_sync_api_puzzle?(json)
    hash_properties_are_valid?(json, display_name: "puzzle_data", props: [
      ["center_letter", String, ->(p) { valid_letter?(p) }],
      ["created_at", String, ->(p) { valid_date?(p) }],
      ["date", String, ->(p) { valid_date?(p) }],
      ["excluded_words", Array, ->(p) { valid_word_array?(p) }],
      ["id", Integer, ->(p) { PuzzleIdentifierService.validate_id_format(p) }],
      ["origin_id", Integer],
      ["origin_type", String, ->(p) { valid_origin_type?(p) }],
      ["outer_letters", Array, ->(p) { valid_outer_letters?(p) }],
      ["updated_at", String, ->(p) { valid_date?(p) }],
    ],)
  end

  def valid_letter?(letter)
    result = letter.match?(/\A[a-zA-Z]\z/)
    @logger.error "TypeError: Invalid letter: #{letter}" unless result
    result
  end

  def valid_outer_letters?(letters)
    raise TypeError, "Not an array: #{letters}" unless letters.is_a?(Array)

    unless letters.length == 6
      raise TypeError, "#Letters array is the wrong length: #{letters.length}"
    end

    unless letters.all? { |letter| valid_letter?(letter) }
      raise TypeError, "#Must be letters: #{letters}"
    end

    return true
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_word_array?(answer_words)
    raise TypeError, "Not an array: #{answer_words}" unless answer_words.is_a?(Array)
    unless answer_words.all? { |answer| answer.is_a?(String) }
      raise TypeError, "Some answers aren't strings: #{answer_words}"
    end
    return true
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_origin_type?(origin_type)
    %w[NytPuzzle SbSolverPuzzle].include?(origin_type)
  end
end
