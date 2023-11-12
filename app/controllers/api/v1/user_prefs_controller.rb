# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Api::V1::UserPrefsController < AuthRequiredController
  before_action :set_user_pref

  # GET /user_prefs/1
  def show
    render json: @user_pref.to_front_end
  end

  # PATCH/PUT /user_prefs/1
  def update
    if @user_pref.update(user_pref_params)
      render json: @user_pref.to_front_end
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  # Might not be needed
  def get_current_hint_profile
    render json: @user_pref.current_hint_profile.to_front_end_complete
  end

  # Might not be needed
  def set_current_hint_profile
    if @user_pref.update(
      current_hint_profile_type: params[:current_hint_profile_type].to_s,
      current_hint_profile_id: params[:current_hint_profile_id].to_i
    )
      render json: @user_pref.current_hint_profile.to_front_end_complete
    end
  end

  private

  def set_user_pref
    @user_pref = UserPref.find_by_user_id(current_user.id)
  end

  def user_pref_params
    params.permit(:color_scheme, :current_hint_profile_type, :current_hint_profile_id)
  end
end
