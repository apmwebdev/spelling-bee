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
class FrontEndApi::V1::UserHintProfilesController < FrontEndApi::AuthRequiredController
  before_action :set_user_hint_profile, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: :all_hint_profiles_index

  def all_hint_profiles_index
    if user_signed_in?
      render json: HintPresenter.present_all_profiles(current_user)
    else
      render json: HintPresenter.present_default_profiles
    end
  end

  # GET /user_hint_profiles
  def index
    @user_hint_profiles = UserHintProfile.find_by_user_id(current_user.id)

    render json: @user_hint_profiles
  end

  # GET /user_hint_profiles/1
  def show
    render json: @user_hint_profile.to_front_end_complete
  end

  # POST /user_hint_profiles
  def create
    error_base = "Couldn't create hint profile"
    if current_user.user_hint_profiles.count >= 20
      raise ApiError, "#{error_base}: You have reached the maximum number of hint profiles."
    end

    @user_hint_profile = UserHintProfile.new(user_hint_profile_params)

    begin
      @user_hint_profile.save!
      render json: @user_hint_profile.to_front_end_complete, status: 201
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @user_hint_profile.errors)
    end
  end

  # PATCH/PUT /user_hint_profiles/1
  def update
    error_base = "Couldn't update hint profile"
    begin
      @user_hint_profile.update!(user_hint_profile_params)
      # TODO: Does this need to be `to_front_end_complete` ?
      render json: @user_hint_profile.to_front_end_complete
    rescue ActiveRecord::RecordInvalid => e
      raise RecordInvalidError.new(error_base, e, @user_hint_profile.errors)
    end
  end

  # DELETE /user_hint_profiles/1
  def destroy
    @user_hint_profile.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_hint_profile
    # TODO: Change to use UUID
    @user_hint_profile = current_user.user_hint_profiles.find(params[:id])
  rescue ActiveRecord::RecordNotFound => e
    raise NotFoundError.new("Couldn't set user hint profile", "User hint profile", e)
  end

  # Only allow a list of trusted parameters through.
  def user_hint_profile_params
    params.require(:user_hint_profile).permit(
      :name, :user_id, :default_panel_tracking,
      default_panel_display_state_attributes: [:is_expanded, :is_blurred,
        :is_sticky, :is_settings_expanded, :is_settings_sticky,],
    )
  end
end
