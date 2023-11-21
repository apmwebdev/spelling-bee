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
    unless params[:attempt_id]
      render json: {error: "Must include attempt ID"}, status: 400
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
      .where(user_puzzle_attempt_id: params[:attempt_id])
      .map { |search| search.to_front_end }

    render json: searches
  end

  def create
    @search = SearchPanelSearch.new(sps_params)

    if @search.save
      render json: @search.to_front_end, status: :created
    else
      render json: @search.errors, status: :unprocessable_entity
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
  end

  def sps_params
    params.require(:search_panel_search).permit(
      :id,
      :search_panel_id,
      :user_puzzle_attempt_id,
      :search_string,
      :location,
      :letters_offset,
      :output_type,
      :created_at
    )
  end
end
