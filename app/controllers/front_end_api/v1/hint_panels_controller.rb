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
class FrontEndApi::V1::HintPanelsController < FrontEndApi::AuthRequiredController
  before_action :set_hint_panel, only: %i[update destroy move]

  # POST /hint_panels
  def create
    error_base = "Couldn't create hint panel"
    profile_uuid = hint_panel_create_params[:hint_profile_uuid]
    profile = current_user.user_hint_profiles.find(profile_uuid)

    if profile.hint_panels.count >= 20
      raise ApiError,
        "#{error_base}: You have reached the maximum number of hint panels for this hint profile."
    end

    @hint_panel = HintPanel.new(hint_panel_create_params)

    begin
      @hint_panel.save_with_uuid_retry!
      render json: @hint_panel, status: 201
    rescue UuidRetryable::RetryLimitExceeded => e
      raise e
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @hint_panel.errors)
    end
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new(error_base, "User hint profile", e)
  end

  # PATCH/PUT /hint_panels/1
  def update
    error_base = "Couldn't update hint panel"
    if @hint_panel.hint_profile.instance_of?(::DefaultHintProfile)
      raise ApiError.new(
        "#{error_base}: Unable to persist changes to default hint profiles",
        403,
      )
    end
    the_params = hint_panel_update_params
    if the_params[:initial_display_state_attributes] &&
       !@hint_panel.initial_display_state.update(the_params[:initial_display_state_attributes])

      raise RecordInvalidError.new(error_base, nil, @hint_panel.initial_display_state.errors)
    end
    if the_params[:current_display_state_attributes] &&
       !@hint_panel.current_display_state.update(the_params[:current_display_state_attributes])

      raise RecordInvalidError.new(error_base, nil, @hint_panel.current_display_state.errors)
    end

    if the_params[:panel_subtype_attributes]
      case @hint_panel.panel_subtype_type
      when "LetterPanel"
        unless @hint_panel.panel_subtype.update(letter_update_params)
          raise RecordInvalidError.new(error_base, nil, @hint_panel.panel_subtype.errors)
        end
      when "SearchPanel"
        unless @hint_panel.panel_subtype.update(search_update_params)
          raise RecordInvalidError.new(error_base, nil, @hint_panel.panel_subtype.errors)
        end
      when "ObscurityPanel"
        unless @hint_panel.panel_subtype.update(obscurity_update_params)
          raise RecordInvalidError.new(error_base, nil, @hint_panel.panel_subtype.errors)
        end
      when "DefinitionPanel"
        unless @hint_panel.panel_subtype.update(definition_update_params)
          raise RecordInvalidError.new(error_base, nil, @hint_panel.panel_subtype.errors)
        end
      end
    end
    if @hint_panel.update(
      hint_panel_update_params.except(
        :initial_display_state_attributes,
        :current_display_state_attributes,
        :panel_subtype_attributes,
      ),
    )

      render json: @hint_panel.to_front_end
    else
      raise RecordInvalidError.new(error_base, nil, @hint_panel.errors)
    end
  end

  # DELETE /hint_panels/1
  def destroy
    @hint_panel.destroy
  end

  def move
    move_params = hint_panel_move_params
    old_index = move_params[:old_index].to_i
    new_index = move_params[:new_index].to_i
    panels = HintPanel
      .where(hint_profile_type: "UserHintProfile")
      .where(hint_profile_uuid: @hint_panel.hint_profile_uuid)

    if old_index > panels.size || new_index > panels.size || old_index.negative? ||
       new_index.negative? || old_index == new_index || panels.size < 2

      raise ApiError, "Invalid move"
    end

    panels_array = panels
      .to_a
      .sort_by(&:display_index)
    panels_array
      .insert(new_index, panels_array.delete_at(old_index))
    relevant_panels = panels_array.slice(
      new_index > old_index ? old_index : new_index,
      (old_index - new_index).abs + 1,
    )
      .each_with_index do |panel, i|
        panel.display_index = i
        panel.save
      end
    render json: relevant_panels.map { |panel| { name: panel.name, index: panel.display_index } }
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_hint_panel
    @hint_panel = current_user.hint_panels.find_by!(uuid: params[:uuid])
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't set hint panel", "Hint panel", e)
  end

  def hint_panel_create_params
    params.require(:hint_panel).permit(
      :uuid,
      :name,
      :hint_profile_uuid,
      :status_tracking,
      :panel_subtype_type,
      initial_display_state_attributes: %i[
        uuid
        is_expanded
        is_blurred
        is_sticky
        is_settings_expanded
        is_settings_sticky
      ],
      current_display_state_attributes: %i[
        uuid
        is_expanded
        is_blurred
        is_sticky
        is_settings_expanded
        is_settings_sticky
      ],
      panel_subtype_attributes: %i[
        uuid
        hide_known
        reveal_length
        show_obscurity
        sort_order
        location
        output_type
        number_of_letters
        letters_offset
        separate_known
        revealed_letters
        click_to_define
      ],
    )
  end

  # Only allow a list of trusted parameters through.
  def hint_panel_update_params
    params.require(:hint_panel).permit(
      :name,
      :hint_profile_uuid,
      :status_tracking,
      initial_display_state_attributes: %i[
        is_expanded
        is_blurred
        is_sticky
        is_settings_expanded
        is_settings_sticky
      ],
      current_display_state_attributes: %i[
        is_expanded
        is_blurred
        is_sticky
        is_settings_expanded
        is_settings_sticky
      ],
      panel_subtype_attributes: %i[
        hide_known
        reveal_length
        show_obscurity
        sort_order
        location
        output_type
        number_of_letters
        letters_offset
        separate_known
        revealed_letters
        click_to_define
        sort_order
      ],
    )
  end

  def letter_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :hide_known,
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
      :hide_known,
      :revealed_letters,
      :separate_known,
      :reveal_length,
      :click_to_define,
      :sort_order,
    )
  end

  def definition_update_params
    params[:hint_panel].fetch(:panel_subtype_attributes).permit(
      :hide_known,
      :revealed_letters,
      :reveal_length,
      :show_obscurity,
      :sort_order,
    )
  end

  def hint_panel_move_params
    params.require(%i[uuid old_index new_index])
  end
end
