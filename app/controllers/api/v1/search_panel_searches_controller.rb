class Api::V1::SearchPanelSearchesController < AuthRequiredController

  def for_attempt_and_profile
    unless params[:attempt_id]
      render json: { error: "Must include attempt ID" }, status: 400
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

    render json: searches.map { |search| search.to_front_end }
  end

  private

  def for_attempt_and_profile_params
    params.require(:attempt_id)
  end
end

