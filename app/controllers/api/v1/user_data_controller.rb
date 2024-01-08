# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::UserDataController < ApplicationController
  # before_action :authenticate_user!, only: :user_puzzle_data

  def user_base_data
    if user_signed_in?
      render json: UserDataPresenter.present_user_base_data(current_user)
    else
      render json: UserDataPresenter.present_guest_base_data
    end
  end

  def user_puzzle_data
    unless user_signed_in?
      render json: {error: "User not found"}, status: 401
      return
    end
    unless /\A\d{1,5}\z/.match?(params[:puzzle_id].to_s)
      render json: {error: "Invalid puzzle ID"}, status: 400
      return
    end
    puzzle_id = params[:puzzle_id].to_i
    unless Puzzle.exists?(puzzle_id)
      render json: {error: "Puzzle not found"}, status: 404
      return
    end
    # Attempts
    @user_puzzle_attempts = UserPuzzleAttempt
      .where("puzzle_id = ?", puzzle_id)
      .where(user: current_user)
      .order(:created_at)

    if @user_puzzle_attempts.any?
      attempts = @user_puzzle_attempts.map do |attempt|
        attempt.to_front_end
      end
      guesses = @user_puzzle_attempts.last.guesses
        .map { |guess| guess.to_front_end }
    else
      new_attempt = UserPuzzleAttempt.new(user: current_user, puzzle_id:)
      begin
        new_attempt.save_with_uuid_retry!
      rescue UuidRetryable::RetryLimitExceeded
        render json: {
          error: "Could not create user puzzle attempt due to a rare UUID collision"
        }, status: 500
      end
      attempts = [new_attempt.to_front_end]
      guesses = []
    end
    # Searches
    searches = SearchPanelSearch
      .where(search_panel: SearchPanel
        .where(hint_panel: current_user
          .user_pref
          .current_hint_profile
          .hint_panels
          .where(panel_subtype_type: "SearchPanel")))
      .where(user_puzzle_attempt_id: attempts.last[:id])
      .map { |search| search.to_front_end }

    render json: {searches:, attempts:, currentAttempt: attempts.last[:uuid], guesses:}
  end
end
