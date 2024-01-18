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

require "securerandom"

# :nodoc:
class FrontEndApi::V1::GuessesController < FrontEndApi::AuthRequiredController
  include TimestampConverter
  before_action :set_guess, only: %i[show update destroy]

  # GET /user_puzzle_attempt_guesses/:attempt_uuid
  def index_for_attempt
    guesses = current_user.user_puzzle_attempts
      .find_by!(uuid: params[:user_puzzle_attempt_uuid])
      .guesses.map(&:to_front_end)
    render json: guesses, status: 200
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't fetch guesses", "User puzzle attempt", e)
  end

  # POST /guesses
  def create
    error_base = "Couldn't create guess"
    user_puzzle_attempt = current_user.user_puzzle_attempts
      .find_by!(uuid: guess_params[:user_puzzle_attempt_uuid])

    if user_puzzle_attempt.guesses.count >= 200
      raise ApiError,
        "#{error_base}: You've reached the maximum number of guesses for this puzzle attempt."
    end

    @guess = user_puzzle_attempt.guesses.new(guess_params.except(:created_at))
    @guess.created_at = railsify_timestamp(guess_params[:created_at])

    begin
      @guess.save_with_uuid_retry!
      render json: @guess.to_front_end, status: 201
    rescue UuidRetryable::RetryLimitExceeded => e
      raise e
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @guess.errors)
    end
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new(error_base, "User puzzle attempt", e)
  end

  def bulk_add
    error_base = "Couldn't create guess"
    return_array = []
    bulk_add_params.each do |item|
      item_status = { uuid: item[:uuid], isSuccess: false }
      begin
        current_user.user_puzzle_attempts
          .find_by!(uuid: item[:user_puzzle_attempt_uuid])
        new_guess = Guess.new(item.except(:created_at))
        new_guess.created_at = railsify_timestamp(item[:created_at])
        new_guess.save_with_uuid_retry!
        item_status[:newUuid] = new_guess.uuid unless item_status[:uuid] == new_guess.uuid
        item_status[:isSuccess] = true
        error = nil
      rescue ActiveRecord::RecordNotFound => e
        error = NotFoundError.new(error_base, "User puzzle attempt", e)
      rescue UuidRetryable::RetryLimitExceeded => e
        error = e
      rescue ActiveRecord::RecordInvalid => e
        active_model_errors = new_guess.errors if new_guess && new_guess.errors.present?
        error = RecordInvalidError.new(error_base, e)
        error.active_model_errors = active_model_errors if active_model_errors
      rescue StandardError => e
        error = ApiError.new(message: error_base, original_error: e)
      end
      item_status[:error] = error.to_front_end if error
      return_array.push(item_status)
    end
    render json: return_array, status: 200
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_guess
    @guess = current_user.guesses.find_by!(uuid: params[:uuid])
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't set guess", "Guess", e)
  end

  # Only allow a list of trusted parameters through.
  def guess_params
    params
      .require(:guess)
      .permit(:uuid, :user_puzzle_attempt_uuid, :text, :created_at, :is_spoiled)
  end

  def bulk_add_params
    params.require(:guesses)
      .map do |item|
        item
          .permit(:uuid, :user_puzzle_attempt_uuid, :text, :created_at, :is_spoiled)
          .to_h
      end
  end
end
