# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::UserHintProfilesController < AuthRequiredController
  before_action :set_user_hint_profile, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: :get_all_hint_profiles

  def get_all_hint_profiles
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
    @user_hint_profile = UserHintProfile.new(user_hint_profile_params)

    if @user_hint_profile.save
      render json: @user_hint_profile.to_front_end_complete, status: :created, location: @user_hint_profile
    else
      render json: @user_hint_profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_hint_profiles/1
  def update
    if @user_hint_profile.update(user_hint_profile_params)
      render json: @user_hint_profile.to_front_end_complete
    else
      render json: @user_hint_profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_hint_profiles/1
  def destroy
    @user_hint_profile.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_hint_profile
    profile = UserHintProfile.find(params[:id])
    unless profile.user == current_user
      render json: {error: "User and hint profile don't match"}, status: 403
      return
    end
    @user_hint_profile = profile
  end

  # Only allow a list of trusted parameters through.
  def user_hint_profile_params
    params.require(:user_hint_profile).permit(
      :name, :user_id, :default_panel_tracking,
      default_panel_display_state_attributes: [:is_expanded, :is_blurred,
        :is_sticky, :is_settings_expanded, :is_settings_sticky]
    )
  end
end
