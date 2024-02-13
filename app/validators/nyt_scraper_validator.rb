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

# Validates data scraped by NytScraperService
class NytScraperValidator < ExternalServiceValidatorBase
  def initialize(logger)
    super
    @puzzle_validator = PuzzleJsonValidator.new(logger)
  end

  def valid?(json)
    valid_hash?(json, display_name: "response", props: [
      ["today", Hash, ->(p) { @puzzle_validator.valid_nyt_puzzle?(p) }],
      ["pastPuzzles", Hash, ->(p) { past_puzzles_valid?(p) }],
    ],)
  end

  def past_puzzles_valid?(json)
    valid_hash?(json, display_name: "pastPuzzles", props: [
      ["thisWeek", Array, ->(p) { valid_puzzle_array?(p) }],
      ["lastWeek", Array, ->(p) { valid_puzzle_array?(p) }],
    ],)
  end

  def today_valid?(json)
    raise TypeError, "'json' is not a hash." unless json.is_a?(Hash)
    raise TypeError, "Key 'today' doesn't exist in hash." unless json.key?("today")
    @puzzle_validator.valid_nyt_puzzle?(json["today"])
  rescue TypeError => e
    @logger.exception e
    return false
  end

  def valid_puzzle_array?(puzzles)
    raise TypeError, "puzzles is not an array: #{puzzles}" unless puzzles.is_a?(Array)
    unless puzzles.all? { |puzzle| @puzzle_validator.valid_nyt_puzzle?(puzzle) }
      raise TypeError, "Not all puzzles are valid"
    end
    return true
  rescue TypeError => e
    @logger.exception e
    return false
  end
end
