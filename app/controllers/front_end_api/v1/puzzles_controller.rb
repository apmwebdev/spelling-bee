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
class FrontEndApi::V1::PuzzlesController < FrontEndApi::FrontEndApiController
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
    render json: @puzzle.to_front_end
  end

  # GET /puzzles/latest
  def latest
    render json: Puzzle.includes(:answers, :words).last.to_front_end
  end

  private

  # Find puzzle by ID, date string, or letters
  def set_puzzle
    identifier = params[:identifier].to_s
    @puzzle = PuzzleIdentifierService.find_puzzle(identifier)
    # find_puzzle raises ApiErrors, which will be rescued in ApplicationController
  end

  # Only allow a list of trusted parameters through.
  def puzzle_params
    params.require(:puzzle).permit(:date, :center_letter, :outer_letters, :origin)
  end
end
