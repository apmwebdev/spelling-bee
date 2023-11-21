# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::UserPuzzleAttemptsController < AuthRequiredController
  before_action :set_user_puzzle_attempt, only: %i[show update destroy]

  # GET /user_puzzle_attempts
  def index
    @user_puzzle_attempts = UserPuzzleAttempt.find_by_user_id(current_user.id)

    render json: @user_puzzle_attempts
  end

  # GET /user_puzzle_attempts_for_puzzle
  def index_for_puzzle
    unless /\A\d{1,5}\z/.match?(params[:puzzle_id].to_s)
      render json: {error: "Invalid puzzle ID"}, status: :bad_request
      return
    end
    puzzle_id = params[:puzzle_id].to_i
    unless Puzzle.exists?(puzzle_id)
      render json: {error: "Puzzle not found"}, status: :not_found
      return
    end
    @user_puzzle_attempts = UserPuzzleAttempt
      .includes(:guesses)
      .where("puzzle_id = ?", puzzle_id)
      .where(user: current_user)
    if @user_puzzle_attempts.any?
      attempts_array = @user_puzzle_attempts.map do |attempt|
        attempt.to_front_end
      end
      render json: attempts_array
    else
      new_attempt = UserPuzzleAttempt.create!(user: current_user, puzzle_id:)
      render json: [new_attempt.to_front_end]
    end
  end

  # GET /user_puzzle_attempts/1
  def show
    render json: @user_puzzle_attempt
  end

  # POST /user_puzzle_attempts
  def create
    @user_puzzle_attempt = UserPuzzleAttempt.new(user_puzzle_attempt_params)
    @user_puzzle_attempt.user = current_user

    if @user_puzzle_attempt.save
      render json: @user_puzzle_attempt.to_front_end, status: 201
    else
      render json: @user_puzzle_attempt.errors, status: 422
    end
  end

  # DELETE /user_puzzle_attempts/1
  def destroy
    @user_puzzle_attempt.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_puzzle_attempt
    @user_puzzle_attempt = current_user.user_puzzle_attempts
      .find_by(uuid: params[:uuid])
  end

  # Only allow a list of trusted parameters through.
  def user_puzzle_attempt_params
    params.require(:user_puzzle_attempt)
      .permit(:uuid, :puzzle_id, :created_at)
  end
end
