class Api::V1::HintPanelsController < AuthRequiredController
  before_action :set_hint_panel, only: %i[ update destroy ]

  # POST /hint_panels
  def create
    @hint_panel = HintPanel.new(hint_panel_params)

    if @hint_panel.save
      render json: @hint_panel, status: :created, location: @hint_panel
    else
      render json: @hint_panel.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /hint_panels/1
  def update
    if @hint_panel.update(hint_panel_params)
      render json: @hint_panel
    else
      render json: @hint_panel.errors, status: :unprocessable_entity
    end
  end

  # DELETE /hint_panels/1
  def destroy
    @hint_panel.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hint_panel
      panel = HintPanel.find(params[:id])
      unless panel.hint_profile_type == "UserHintProfile" && panel.hint_profile.user == current_user
        render json: {error: "User and hint profile don't match"}, status: 403
        return
      end
      @hint_panel = panel
    end

    # Only allow a list of trusted parameters through.
    def hint_panel_params
      params.require(:hint_panel).permit(:name, :hint_profile_id, :initial_display_state_id, :current_display_state_id, :status_tracking, :panel_subtype_id, :panel_subtype_type)
    end
end
