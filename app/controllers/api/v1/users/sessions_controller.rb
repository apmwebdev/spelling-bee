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

# Controls login and logout
class Api::V1::Users::SessionsController < Devise::SessionsController
  include RackSessionsFix
  respond_to :json

  def check_auth
    if user_signed_in?
      render json: {
        isAuthenticated: true,
        user: current_user.to_front_end,
      }
      return
    end
    render json: { isAuthenticated: false }
  end

  private

  def respond_with(current_user, _opts = {})
    render json: current_user.to_front_end
  end

  def respond_to_on_destroy
    raise ApiError.new("Couldn't find an active sessions", 401) unless current_user

    render json: { success: "Logged out successfully." }
  end
end
