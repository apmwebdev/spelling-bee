class Api::V1::HintPanelsController < AuthRequiredController
  before_action :set_hint_panel, only: %i[ update destroy ]

  # POST /hint_panels
  def create
    @hint_panel = HintPanel.new(hint_panel_create_params)

    if @hint_panel.save
      render json: @hint_panel, status: :created, location: @hint_panel
    else
      render json: @hint_panel.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /hint_panels/1
  def update
    if @hint_panel.hint_profile.class.name == "DefaultHintProfile"
      render json: { error: "Can't change default profiles" }, status: 403
    end
    the_params = hint_panel_update_params
    if the_params[:initial_display_state_attributes]
      unless @hint_panel.initial_display_state.update(the_params[:initial_display_state_attributes])
        render json: @hint_panel.initial_display_state.errors, status: :unprocessable_entity
        return
      end
    end
    if the_params[:current_display_state_attributes]
      unless @hint_panel.current_display_state.update(the_params[:current_display_state_attributes])
        render json: @hint_panel.current_display_state.errors, status: :unprocessable_entity
        return
      end
    end
    if the_params[:panel_subtype_attributes]
      if @hint_panel.panel_subtype_type == "LetterPanel"
        unless @hint_panel.panel_subtype.update(letter_update_params)
          render json: @hint_panel.panel_subtype.errors, status: :unprocessable_entity
          return
        end
      elsif @hint_panel.panel_subtype_type == "SearchPanel"
        unless @hint_panel.panel_subtype.update(search_update_params)
          render json: @hint_panel.panel_subtype.errors, status: :unprocessable_entity
          return
        end
      elsif @hint_panel.panel_subtype_type == "ObscurityPanel"
        unless @hint_panel.panel_subtype.update(obscurity_update_params)
          render json: @hint_panel.panel_subtype.errors, status: :unprocessable_entity
          return
        end
      elsif @hint_panel.panel_subtype_type =="DefinitionPanel"
        unless @hint_panel.panel_subtype.update(definition_update_params)
          render json: @hint_panel.panel_subtype.errors, status: :unprocessable_entity
          return
        end
      end
    end
    if @hint_panel.update(
      hint_panel_update_params.except(
        :initial_display_state_attributes,
        :current_display_state_attributes,
        :panel_subtype_attributes,
      )
    )
      render json: @hint_panel.to_front_end
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

  def hint_panel_create_params
    params.require(:hint_panel).permit(
      :name,
      :hint_profile_id,
      :status_tracking,
      :panel_subtype_type,
      initial_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky,
      ],
      current_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky,
      ],
      panel_subtype_attributes: [
        :show_known,
        :reveal_length,
        :show_obscurity,
        :sort_order,
        :location,
        :output_type,
        :number_of_letters,
        :letters_offset,
        :separate_known,
        :revealed_letters,
        :click_to_define,
      ],
    )
  end
  # Only allow a list of trusted parameters through.
  def hint_panel_update_params
    params.require(:hint_panel).permit(
      :id,
      :name,
      :hint_profile_id,
      :status_tracking,
      initial_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky,
      ],
      current_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky,
      ],
      panel_subtype_attributes: [
        :show_known,
        :reveal_length,
        :show_obscurity,
        :sort_order,
        :location,
        :output_type,
        :number_of_letters,
        :letters_offset,
        :separate_known,
        :revealed_letters,
        :click_to_define,
        :sort_order
      ],
    )
  end

  def letter_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :show_known,
      :location,
      :output_type,
      :number_of_letters,
      :letters_offset,
    )
  end

  def search_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :location,
      :output_type,
      :letters_offset,
    )
  end

  def obscurity_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :show_known,
      :separate_known,
      :revealed_letters,
      :reveal_length,
      :click_to_define,
      :sort_order,
    )
  end

  def definition_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :show_known,
      :reveal_length,
      :show_obscurity,
      :sort_order,
      :revealed_letters,
    )
  end
end
