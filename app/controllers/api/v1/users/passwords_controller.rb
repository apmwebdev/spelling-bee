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

# For sending password reset emails and updating password from resulting email link
class Api::V1::Users::PasswordsController < Devise::PasswordsController
  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)

    # Devise is in paranoid mode, so successfully_sent? should always evaluate
    # to true
    raise ApiError, "Couldn't send email" unless successfully_sent?(resource)

    render json: {
      success: I18n.t("devise.passwords.send_paranoid_instructions"),
    }
  end

  # GET /api/v1/auth/password/edit?reset_password_token=abcdef
  def edit
    redirect_url = ENV["RESET_PASSWORD_URL"] + params[:reset_password_token]
    redirect_to redirect_url, allow_other_host: true
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)

    raise ApiError.new("Couldn't reset password", 400, resource.errors) unless resource.errors.empty?

    resource.unlock_access! if unlockable?(resource)
    redirect_to ENV["AFTER_PASSWORD_RESET_URL"]
  end
end
