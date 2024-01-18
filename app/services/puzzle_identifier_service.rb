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

# Logic for finding puzzles. Since puzzles can be identified via several different methods, this is
# more complex than a simple find or find_by.
module PuzzleIdentifierService
  # Valid puzzle IDs should be positive integers of 4 or fewer digits. This validation method
  # doesn't guarantee that a "valid" puzzle ID corresponds to an actual puzzle; it is merely a
  # loose filter to eliminate obviously incorrect puzzle IDs without having to make a DB call.
  # Note that while at some point there will be puzzle IDs in the 5 digits, the current date's
  # puzzle ID is 2076, and new puzzles are only being released once a day, so it will take ~22
  # years to get to 5 digit puzzle IDs.
  ID_REGEX = /\A\d{1,4}\z/

  # Letter string format is exactly 7 letters, with any combination of capitals and lowercase.
  LETTER_REGEX = /\A[A-Za-z]{7}\z/

  # Date string format is yyyy_mm_dd, optionally without underscores.
  # Year must start with 20, then a 1 or 2, then any digit.
  # Month must start with a 0 or 1, then any digit.
  # Day must start with a 0, 1, 2, or 3, then any digit.
  # Months and days must be 0-padded (e.g., January is 01, not 1).
  DATE_REGEX = /\A20[1-2]\d_?[0-1]\d_?[0-3]\d\z/

  # Needs to be a stand-alone method because some controllers only accept a puzzle ID as an
  # identifier
  def self.validate_id_format(identifier)
    ID_REGEX.match?(identifier)
  end

  def self.validate_id_format!(identifier)
    raise ValidationError, "Invalid puzzle ID" unless validate_id_format(identifier)
  end

  def self.validate_letter_format(identifier)
    LETTER_REGEX.match?(identifier)
  end

  def self.validate_letter_format!(identifier)
    raise ValidationError, "Invalid puzzle identifier" unless validate_letter_format(identifier)
  end

  def self.validate_date_format(identifier)
    DATE_REGEX.match?(identifier)
  end

  def self.validate_date_format!(identifier)
    raise ValidationError, "Invalid puzzle date" unless validate_date_format(identifier)
  end

  # Find puzzle by ID, date string, or letters
  def self.find_puzzle(identifier)
    # If the identifier is a date string, delete any underscores from it, then
    # convert it to a date and find the puzzle that way.
    if validate_date_format(identifier)
      puzzle_date = Date.parse(identifier.delete("_"))
      Puzzle.includes(:answers, :words).find_by!(date: puzzle_date)

      # If identifier is a letter string, check if there are any capital letters.
      # If there's exactly one, use that as the center letter. Otherwise, use
      # the first letter in the string as the center letter.
    elsif validate_letter_format(identifier)
      # What is the index of the first capital letter? Returns nil for none
      capital_index = /[A-Z]/ =~ identifier
      # How many capital letters are there?
      num_of_caps = identifier.count("A-Z")
      # If there are no capital letters or multiple capital letters, use the
      # first letter as the center letter.
      if capital_index.nil? || num_of_caps > 1
        Puzzle.includes(:answers, :words).find_by!(
          center_letter: identifier.first.downcase,
          outer_letters: identifier[1..6].downcase.chars.sort,
        )
        # Otherwise, there is exactly one capital letter, so use that as the
        # center letter.
      else
        center_letter = identifier[capital_index]
        Puzzle.includes(:answers, :words).find_by!(
          center_letter: center_letter.downcase,
          outer_letters: identifier.delete(center_letter).downcase.chars.sort,
        )
      end

      # If identifier is only digits, check if there's a puzzle with that ID.
    elsif validate_id_format(identifier)
      Puzzle.includes(:answers, :words).find(identifier.to_i)

      # If identifier doesn't match any known format, return a 400.
    else
      raise ApiError.new("Invalid puzzle identifier", 400)
    end
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't find puzzle with provided identifier", "Puzzle", e)
  end
end
