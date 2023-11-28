# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::SearchPanelSearchesController < AuthRequiredController
  before_action :set_search, only: %i[update destroy]

  def for_attempt_and_profile
    unless sps_params[:user_puzzle_attempt_uuid]
      render json: {error: "Must include attempt UUID"}, status: 400
      return
    end

    searches = SearchPanelSearch
      .where(
        search_panel: SearchPanel.where(hint_panel: current_user
          .user_pref
          .current_hint_profile
          .hint_panels
          .where(panel_subtype_type: "SearchPanel"))
      )
      .where(user_puzzle_attempt_uuid: sps_params[:user_puzzle_attempt_uuid])
      .map { |search| search.to_front_end }

    render json: searches
  end

  def create
    begin
      search_panel = current_user.search_panels.find(sps_params[:search_panel_id])
    rescue ActiveRecord::RecordNotFound
      render json: {error: "Search panel not found"}, status: 404
      return
    end

    begin
      user_puzzle_attempt = current_user.user_puzzle_attempts
        .find(sps_params[:user_puzzle_attempt_uuid])
    rescue ActiveRecord::RecordNotFound
      render json: {error: "User puzzle attempt not found"}, status: 404
      return
    end

    if search_panel.search_panel_searches.count >= 20
      render json: {
        error: "You've reached the maximum number of searches for this search panel."
      }, status: 400
      return
    end

    if user_puzzle_attempt.search_panel_searches.count >= 60
      render json: {
        error: "You've reached the maximum number of searches for this puzzle attempt."
      }, status: 400
      return
    end

    @search = SearchPanelSearch.new(sps_params)

    begin
      @search.save_with_uuid_retry!
      render json: @search.to_front_end, status: 201
    rescue UuidRetryable::RetryLimitExceeded
      render json: {
        error: "Could not create guess due to a rare UUID collision"
      }, status: 500
    rescue ActiveRecord::RecordInvalid
      render json: @search.errors, status: 422
    end
  end

  def update
  end

  def destroy
    @search.destroy
    head 204
  end

  private

  def set_search
    # TODO: Make this use UUID instead of ID
    @search = current_user.search_panel_searches.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {error: "Search not found"}, status: 404
  end

  def sps_params
    params.require(:search_panel_search).permit(
      :uuid,
      :search_panel_id,
      :user_puzzle_attempt_uuid,
      :search_string,
      :location,
      :letters_offset,
      :output_type,
      :created_at
    )
  end
end
