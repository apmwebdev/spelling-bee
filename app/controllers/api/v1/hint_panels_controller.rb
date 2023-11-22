# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::HintPanelsController < AuthRequiredController
  before_action :set_hint_panel, only: %i[update destroy move]

  # POST /hint_panels
  def create
    profile_id = hint_panel_create_params[:hint_profile_id]
    profile = current_user.user_hint_profiles.find(profile_id)

    if profile.hint_panels.count >= 20
      render json: {
        error: "You have reached the maximum number of hint panels for this hint profile."
      }, status: 400
      return
    end

    @hint_panel = HintPanel.new(hint_panel_create_params)

    if @hint_panel.save
      render json: @hint_panel, status: 201
    else
      render json: @hint_panel.errors, status: 422
    end
  rescue ActiveRecord::RecordNotFound
    render json: {error: "User hint profile not found"}, status: 404
  end

  # PATCH/PUT /hint_panels/1
  def update
    if @hint_panel.hint_profile.instance_of?(::DefaultHintProfile)
      render json: {error: "Can't change default profiles"}, status: 403
      return
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
      elsif @hint_panel.panel_subtype_type == "DefinitionPanel"
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
        :panel_subtype_attributes
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

  def move
    hint_panel_move_params
    old_index = params[:old_index].to_i
    new_index = params[:new_index].to_i
    panels = HintPanel
      .where(hint_profile_type: "UserHintProfile")
      .where(hint_profile_id: @hint_panel.hint_profile_id)

    if old_index > panels.size || new_index > panels.size || old_index < 0 ||
        new_index < 0 || old_index == new_index || panels.size < 2
      render json: {error: "Invalid move"}, status: 400
      return
    end

    panels_array = panels
      .to_a
      .sort_by { |panel| panel.display_index }
    panels_array
      .insert(new_index, panels_array.delete_at(old_index))
    relevant_panels = panels_array.slice(
      (new_index > old_index) ? old_index : new_index,
      (old_index - new_index).abs + 1
    )
      .each_with_index do |panel, i|
        panel.display_index = i
        panel.save
      end
    render json: relevant_panels.map { |panel| {name: panel.name, index: panel.display_index} }
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_hint_panel
    @hint_panel = current_user.hint_panels.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {error: "Hint panel not found"}, status: 404
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
        :is_settings_sticky
      ],
      current_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky
      ],
      panel_subtype_attributes: [
        :hide_known,
        :reveal_length,
        :show_obscurity,
        :sort_order,
        :location,
        :output_type,
        :number_of_letters,
        :letters_offset,
        :separate_known,
        :revealed_letters,
        :click_to_define
      ]
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
        :is_settings_sticky
      ],
      current_display_state_attributes: [
        :is_expanded,
        :is_blurred,
        :is_sticky,
        :is_settings_expanded,
        :is_settings_sticky
      ],
      panel_subtype_attributes: [
        :hide_known,
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
      ]
    )
  end

  def letter_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :hide_known,
      :location,
      :output_type,
      :number_of_letters,
      :letters_offset
    )
  end

  def search_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :location,
      :output_type,
      :letters_offset
    )
  end

  def obscurity_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :hide_known,
      :revealed_letters,
      :separate_known,
      :reveal_length,
      :click_to_define,
      :sort_order
    )
  end

  def definition_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :hide_known,
      :revealed_letters,
      :reveal_length,
      :show_obscurity,
      :sort_order
    )
  end

  def hint_panel_move_params
    params.require([:id, :old_index, :new_index])
  end
end
