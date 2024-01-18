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
class FrontEndApi::V1::SearchPanelSearchesController < FrontEndApi::AuthRequiredController
  before_action :set_search, only: %i[update destroy]

  def for_attempt_and_profile
    unless sps_params[:user_puzzle_attempt_uuid]
      raise ApiError.new("Error fetching searches", "Must include attempt UUID")
    end

    searches = SearchPanelSearch
      .where(
        search_panel: SearchPanel.where(hint_panel: current_user
          .user_pref
          .current_hint_profile
          .hint_panels
          .where(panel_subtype_type: "SearchPanel")),
      )
      .where(user_puzzle_attempt_uuid: sps_params[:user_puzzle_attempt_uuid])
      .map(&:to_front_end)

    render json: searches
  end

  def create
    error_base = "Couldn't create search"
    begin
      search_panel = current_user.search_panels.find_by!(uuid: sps_params[:search_panel_uuid])
    rescue ActiveRecord::RecordNotFound => e
      raise NotFoundError.new(error_base, "Search panel", e)
    end

    begin
      user_puzzle_attempt = current_user.user_puzzle_attempts
        .find_by!(uuid: sps_params[:user_puzzle_attempt_uuid])
    rescue ActiveRecord::RecordNotFound => e
      raise NotFoundError.new(error_base, "User puzzle attempt", e)
    end

    if search_panel.search_panel_searches.count >= 20
      raise ApiError, "#{error_base}: You've reached the maximum number of searches for this search panel."
    end

    if user_puzzle_attempt.search_panel_searches.count >= 60
      raise ApiError, "#{error_base}: You've reached the maximum number of searches for this puzzle attempt."
    end

    @search = SearchPanelSearch.new(sps_params)
    @search.user_puzzle_attempt = user_puzzle_attempt
    @search.search_panel = search_panel

    begin
      @search.save_with_uuid_retry!
      render json: @search.to_front_end, status: 201
    rescue UuidRetryable::RetryLimitExceeded => e
      raise e
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @search.errors)
    rescue StandardError => e
      raise ApiError.new(message: error_base, original_error: e)
    end
  end

  def update
    raise ApiError.new("Not implemented", 500)
  end

  def destroy
    @search.destroy
    head 204
  end

  private

  def set_search
    @search = current_user.search_panel_searches.find_by!(uuid: params[:uuid])
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't set search", "Search panel search", e)
  end

  def sps_params
    params.require(:search_panel_search).permit(
      :uuid,
      :search_panel_uuid,
      :user_puzzle_attempt_uuid,
      :search_string,
      :location,
      :letters_offset,
      :output_type,
      :created_at,
    )
  end
end
