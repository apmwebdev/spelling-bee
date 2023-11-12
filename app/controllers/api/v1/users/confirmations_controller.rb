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

class Api::V1::Users::ConfirmationsController < Devise::ConfirmationsController
  include RackSessionsFix
  respond_to :json

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    if resource.errors.empty?
      redirect_to ENV["AFTER_CONFIRMATION_URL"]
      return
    end
    redirect_to ENV["AFTER_UNSUCCESSFUL_CONFIRMATION_URL"]
  end

  def resend
    user = User.find_by_email(resend_params[:email])
    if user && !user.confirmed?
      user.resend_confirmation_instructions
    end
    render json: {
      success: I18n.t("devise.confirmations.send_paranoid_instructions")
    }, status: 200
  end

  private

  def resend_params
    params.require(:user).permit(:email)
  end
end
