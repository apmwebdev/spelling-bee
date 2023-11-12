# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::GuessesController < AuthRequiredController
  before_action :set_guess, only: %i[show update destroy]

  # POST /guesses
  def create
    attempt = UserPuzzleAttempt.find(guess_params[:user_puzzle_attempt_id].to_i)
    unless attempt.user == current_user
      render json: {error: "User and attempt don't match"}, status: 403
      return
    end
    @guess = Guess.new(guess_params)

    if @guess.save
      render json: @guess.to_front_end, status: :created
    else
      render json: @guess.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_guess
    @guess = Guess.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def guess_params
    params.require(:guess).permit(:user_puzzle_attempt_id, :text, :is_spoiled)
  end
end
