# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

require "securerandom"

class Api::V1::GuessesController < AuthRequiredController
  before_action :set_guess, only: %i[show update destroy]

  # POST /guesses
  def create
    @guess = current_user.user_puzzle_attempts
      .find_by(uuid: guess_params[:user_puzzle_attempt_uuid])
      .guesses.new(guess_params)

    max_retries = 3
    attempts = 0

    begin
      @guess.save!
      render json: @guess.to_front_end, status: 201
      # TODO: Make the front end check for a different UUID in the response
    rescue ActiveRecord::RecordNotUnique
      attempts += 1
      if attempts < max_retries
        @guess.uuid = SecureRandom.uuid # Generate a new UUID
        retry
      else
        render json: {
          error: "Could not create guess due to a rare UUID collision"
        }, status: 500
      end
    rescue ActiveRecord::RecordInvalid
      render json: @guess.errors, status: 422
    end
  rescue ActiveRecord::RecordNotFound
    render json: {error: "User puzzle attempt not found"}, status: 404
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_guess
    @guess = Guess.find(params[:uuid])
  end

  # Only allow a list of trusted parameters through.
  def guess_params
    params
      .require(:guess)
      .permit(:uuid, :user_puzzle_attempt_uuid, :text, :created_at, :is_spoiled)
  end
end
