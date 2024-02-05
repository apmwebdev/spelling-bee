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
    hash_properties_are_valid?(object: json, object_name: "response", method_name: __method__, props: [
      ["today", Hash, ->(p) { @puzzle_validator.valid_nyt_puzzle?(p) }],
      ["pastPuzzles", Hash, ->(p) { past_puzzles_valid?(p) }],
    ],)
  end

  def past_puzzles_valid?(json)
    hash_properties_are_valid?(object: json, object_name: "pastPuzzles", method_name: __method__, props: [
      ["thisWeek", Array, ->(p) { valid_puzzle_array?(p) }],
      ["lastWeek", Array, ->(p) { valid_puzzle_array?(p) }],
    ],)
  end

  def today_valid?(json)
    method_logger = @logger.with_method("#{self.class.name}##{__method__}")
    unless json.is_a?(Hash)
      method_logger.error "'json' is not a hash."
      return false
    end
    unless json.key?("today")
      method_logger.error "Key 'today' doesn't exist in hash."
      return false
    end

    @puzzle_validator.valid_nyt_puzzle?(json["today"])
  end

  def valid_puzzle_array?(puzzles)
    return false unless puzzles.is_a?(Array)

    puzzles.all? { |puzzle| @puzzle_validator.valid_nyt_puzzle?(puzzle) }
  end
end
