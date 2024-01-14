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

class Api::V1::Users::PasswordsController < Devise::PasswordsController
  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)

    # Devise is in paranoid mode, so successfully_sent? should always evaluate
    # to true
    if successfully_sent?(resource)
      render json: {
        success: I18n.t("devise.passwords.send_paranoid_instructions",)
      }, status: 200
    else
      raise ApiError.new("Couldn't send email")
    end
  end

  # GET /api/v1/auth/password/edit?reset_password_token=abcdef
  def edit
    redirect_url = ENV["RESET_PASSWORD_URL"] + params[:reset_password_token]
    redirect_to redirect_url, allow_other_host: true
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      redirect_to ENV["AFTER_PASSWORD_RESET_URL"]
    else
      raise ApiError.new("Couldn't reset password", 400, resource.errors)
    end
  end
end
