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
class FrontEndApi::V1::UserPuzzleAttemptsController < FrontEndApi::AuthRequiredController
  include TimestampConverter
  before_action :set_user_puzzle_attempt, only: %i[show update destroy]

  # GET /user_puzzle_attempts
  def index
    @user_puzzle_attempts = UserPuzzleAttempt.find_by_user_id(current_user.id)

    render json: @user_puzzle_attempts
  end

  # GET /user_puzzle_attempts_for_puzzle
  def index_for_puzzle
    raise ApiError, "Invalid puzzle ID" unless /\A\d{1,5}\z/.match?(params[:puzzle_id].to_s)

    puzzle_id = params[:puzzle_id].to_i

    raise NotFoundError.new(nil, "Puzzle") unless Puzzle.exists?(puzzle_id)

    @user_puzzle_attempts = UserPuzzleAttempt
      .includes(:guesses)
      .where("puzzle_id = ?", puzzle_id)
      .where(user: current_user)

    if @user_puzzle_attempts.any?
      attempts_array = @user_puzzle_attempts.map(&:to_front_end)
      render json: attempts_array
    else
      render json: []
    end
  end

  # GET /user_puzzle_attempts/1
  def show
    render json: @user_puzzle_attempt
  end

  # POST /user_puzzle_attempts
  def create
    error_base = "Couldn't create user puzzle attempt"
    puzzle_id = user_puzzle_attempt_params[:puzzle_id]
    puzzle = Puzzle.find(puzzle_id)
    existing_attempts_count = current_user.user_puzzle_attempts
      .where(puzzle_id: puzzle.id).count

    if existing_attempts_count >= 10
      raise ApiError,
        "#{error_base}: You've reached the maximum number of attempts for this puzzle."
    end

    @user_puzzle_attempt = UserPuzzleAttempt.new(user_puzzle_attempt_params.except(:created_at))
    @user_puzzle_attempt.user = current_user
    @user_puzzle_attempt.created_at = railsify_timestamp(user_puzzle_attempt_params[:created_at])

    begin
      @user_puzzle_attempt.save_with_uuid_retry!
      render json: @user_puzzle_attempt.to_front_end, status: 201
    rescue UuidRetryable::RetryLimitExceeded => e
      raise e
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @user_puzzle_attempt.errors)
    rescue StandardError => e
      raise ApiError.new(message: error_base, original_error: e)
    end
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new(error_base, "Puzzle", e)
  end

  # DELETE /user_puzzle_attempts/1
  def destroy
    @user_puzzle_attempt.destroy
  end

  # POST /user_puzzle_attempts/bulk_add
  def bulk_add
    error_base = "Couldn't create user puzzle attempt"
    return_array = []
    bulk_add_params.each do |item|
      item_status = { uuid: item[:uuid], isSuccess: false }
      begin
        Puzzle.find(item[:puzzle_id])
        new_attempt = UserPuzzleAttempt.new(item.except(:created_at))
        new_attempt.user = current_user
        new_attempt.created_at = railsify_timestamp(item[:created_at])
        new_attempt.save_with_uuid_retry!
        item_status[:newUuid] = new_attempt.uuid unless item_status[:uuid] == new_attempt.uuid
        item_status[:isSuccess] = true
        error = nil
      rescue ActiveRecord::RecordNotFound => e
        error = NotFoundError.new(error_base, "Puzzle", e)
      rescue UuidRetryable::RetryLimitExceeded => e
        error = e
      rescue ActiveRecord::RecordInvalid => e
        active_model_errors = new_attempt.errors if new_attempt && new_attempt.errors.present?
        error = RecordInvalidError.new(error_base, e)
        error.active_model_errors = active_model_errors if active_model_errors
      rescue StandardError => e
        error = ApiError.new(message: error_base, original_error: e)
      end
      item_status[:error] = error.to_front_end if error
      return_array.push(item_status)
    end
    render json: return_array
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_puzzle_attempt
    @user_puzzle_attempt = current_user.user_puzzle_attempts
      .find_by!(uuid: params[:uuid])
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new(nil, "User puzzle attempt", e)
  end

  # Only allow a list of trusted parameters through.
  def user_puzzle_attempt_params
    params.require(:user_puzzle_attempt)
      .permit(:uuid, :puzzle_id, :created_at)
  end

  def bulk_add_params
    params.require(:user_puzzle_attempts)
      .map do |attempt|
        attempt.permit(:uuid, :puzzle_id, :created_at).to_h
      end
  end
end
