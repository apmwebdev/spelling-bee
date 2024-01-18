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

# :nodoc:
class PuzzleJsonValidator < ExternalServiceValidatorBase
  def valid_nyt_puzzle?(json)
    hash_properties_are_valid?(json, "puzzle", [
      ["displayDate", String, ->(p) { valid_date?(p) }],
      ["centerLetter", String, ->(p) { valid_letter?(p) }],
      ["outerLetters", Array, ->(p) { valid_outer_letters?(p) }],
      ["answers", Array, ->(p) { valid_word_array?(p) }],
    ],)
  end

  def valid_sync_api_puzzle?(json)
    hash_properties_are_valid?(json, "puzzle_data", [
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
    err_log "Invalid letter for puzzle JSON: #{letter}" unless result
    result
  end

  def valid_outer_letters?(letters)
    error_base = "Invalid outer letters for puzzle JSON"
    unless letters.is_a?(Array)
      err_log "#{error_base}: Not an array: #{letters}"
      return false
    end
    unless letters.length == 6
      err_log "#{error_base}: Letters array is the wrong length: #{letters.length}"
      return false
    end
    unless letters.all? { |letter| valid_letter?(letter) }
      err_log "#{error_base}: Must be letters: #{letters}"
      return false
    end
    return true
  end

  def valid_word_array?(answer_words)
    error_base = "Invalid answer words"
    unless answer_words.is_a?(Array)
      err_log "#{error_base}: Not an array: #{answer_words}"
      return false
    end
    unless answer_words.all? { |answer| answer.is_a?(String) }
      err_log "#{error_base}: Some answers aren't strings: #{answer_words}"
      return false
    end
    return true
  end

  def valid_origin_type?(origin_type)
    %w[NytPuzzle SbSolverPuzzle].include?(origin_type)
  end
end