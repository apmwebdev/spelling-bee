# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# frozen_string_literal: true

class Api::V1::Users::SessionsController < Devise::SessionsController
  include RackSessionsFix
  respond_to :json

  def check_auth
    if user_signed_in?
      render json: current_user.to_front_end, status: 200
      return
    end
    render json: {error: "No user"}, status: 404
  end

  private

  def respond_with(current_user, _opts = {})
    render json: current_user.to_front_end, status: 200
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        success: "Logged out successfully."
      }, status: 200
    else
      render json: {
        error: "Couldn't find an active session."
      }, status: 401
    end
  end
end
