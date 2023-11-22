# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::PuzzlesController < ApplicationController
  before_action :set_puzzle, only: %i[show update destroy]

  # GET /puzzles
  def index
    @puzzles = Puzzle.all

    render json: @puzzles
  end

  # GET /puzzles/1899 (by ID)
  # GET /puzzles/2023_07_20 (by date)
  # GET /puzzles/laehivy (by letters)
  def show
    render(json: @puzzle.to_front_end)
  end

  # GET /puzzles/latest
  # Get the latest puzzle and redirect to :show with its date string
  def latest
    render(json: Puzzle.last.to_front_end)
  end

  private

  # Find puzzle by ID, date string, or letters
  def set_puzzle
    identifier = params[:identifier].to_s

    # Date string format is yyyy_mm_dd, optionally without underscores.
    # Year must start with 20, then a 1 or 2, then any digit.
    # Month must start with a 0 or 1, then any digit.
    # Day must start with a 0, 1, 2, or 3, then any digit.
    # Months and days must be 0-padded (e.g., January is 01, not 1).
    date_regex = /\A20[1-2]\d_?[0-1]\d_?[0-3]\d\z/

    # Letter string format is exactly 7 letters, with any combination of
    # capitals and lowercase.
    letter_regex = /\A[A-Za-z]{7}\z/

    # ID format is one or more digits.
    id_regex = /\A\d+\z/

    # If the identifier is a date string, delete any underscores from it, then
    # convert it to a date and find the puzzle that way.
    if identifier.match(date_regex)
      puzzle_date = Date.parse(identifier.delete("_"))
      @puzzle = Puzzle.includes(:answers, :words).find_by_date(puzzle_date)

      # If identifier is a letter string, check if there are any capital letters.
      # If there's exactly one, use that as the center letter. Otherwise, use
      # the first letter in the string as the center letter.
    elsif identifier.match(letter_regex)
      # What is the index of the first capital letter? Returns nil for none
      capital_index = /[A-Z]/ =~ identifier
      # How many capital letters are there?
      num_of_caps = identifier.count("A-Z")
      # If there are no capital letters or multiple capital letters, use the
      # first letter as the center letter.
      if capital_index.nil? || num_of_caps > 1
        @puzzle = Puzzle.includes(:answers, :words).find_by(
          center_letter: identifier.first.downcase,
          outer_letters: identifier[1..6].downcase.chars.sort
        )
        # Otherwise, there is exactly one capital letter, so use that as the
        # center letter.
      else
        center_letter = identifier[capital_index]
        @puzzle = Puzzle.includes(:answers, :words).find_by(
          center_letter: center_letter.downcase,
          outer_letters: identifier.delete(center_letter).downcase.chars.sort
        )
      end

      # If identifier is only digits, check if there's a puzzle with that ID.
    elsif identifier.match(id_regex)
      @puzzle = Puzzle.includes(:answers, :words).find(identifier.to_i)

      # If identifier doesn't match any known format, return a 400.
    else
      render json: {}, status: :bad_request
    end
  end

  # Only allow a list of trusted parameters through.
  def puzzle_params
    params.require(:puzzle).permit(:date, :center_letter, :outer_letters, :origin)
  end
end
