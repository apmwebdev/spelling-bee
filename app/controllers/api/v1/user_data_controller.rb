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
class Api::V1::UserDataController < ApplicationController
  def user_base_data
    if user_signed_in?
      render json: UserDataPresenter.present_user_base_data(current_user)
    else
      render json: UserDataPresenter.present_guest_base_data
    end
  end

  def user_puzzle_data
    raise ApiError, "Invalid puzzle ID" unless /\A\d{1,5}\z/.match?(params[:puzzle_id].to_s)

    puzzle_id = params[:puzzle_id].to_i

    raise NotFoundError.new(nil, "Puzzle") unless Puzzle.exists?(puzzle_id)

    unless user_signed_in?
      render json: { isAuthenticated: false }
      return
    end
    # Attempts
    @user_puzzle_attempts = UserPuzzleAttempt
      .where("puzzle_id = ?", puzzle_id)
      .where(user: current_user)
      .order(:created_at)

    if @user_puzzle_attempts.any?
      attempts = @user_puzzle_attempts.map(&:to_front_end)
      guesses = @user_puzzle_attempts.last.guesses
        .map(&:to_front_end)
    else
      attempts = []
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
      .map(&:to_front_end)

    render json: {
      isAuthenticated: true,
      data: {
        attempts:,
        searches:,
        guesses:,
        currentAttempt: attempts.last[:uuid],
      },
    }
  end
end
