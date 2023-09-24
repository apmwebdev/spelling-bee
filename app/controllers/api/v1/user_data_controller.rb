class Api::V1::UserDataController < ApplicationController
  before_action :authenticate_user!, only: :user_puzzle_data

  def user_base_data
    if user_signed_in?
      render json: UserDataPresenter.present_user_base_data(current_user)
    else
      render json: UserDataPresenter.present_guest_base_data
    end
  end

  def user_puzzle_data
    unless params[:puzzle_id].to_s.match(/\A\d{1,5}\z/)
      render json: {error: "Invalid puzzle ID"}, status: :bad_request
      return
    end
    puzzle_id = params[:puzzle_id].to_i
    unless Puzzle.exists?(puzzle_id)
      render json: {error: "Puzzle not found"}, status: :not_found
      return
    end
    # Attempts
    @user_puzzle_attempts = UserPuzzleAttempt
      .includes(:guesses)
      .where("puzzle_id = ?", puzzle_id)
      .where(user: current_user)
    if @user_puzzle_attempts.any?
      attempts = @user_puzzle_attempts.map do |attempt|
        attempt.to_front_end
      end
    else
      new_attempt = UserPuzzleAttempt.create!(user: current_user, puzzle_id:)
      attempts = [new_attempt.to_front_end]
    end
    # Searches
    searches = SearchPanelSearch
      .where(search_panel: SearchPanel
        .where(hint_panel: current_user
          .user_pref
          .current_hint_profile
          .hint_panels
          .where(panel_subtype_type: "SearchPanel")
        )
      )
      .where(user_puzzle_attempt_id: attempts.last[:id])
      .map{ |search| search.to_front_end }

    render json: { searches:, attempts:, currentAttempt: attempts.last[:id] }
  end
end
