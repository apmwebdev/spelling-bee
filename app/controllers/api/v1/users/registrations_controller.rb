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

class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionsFix
  respond_to :json

  def update
    resource_updated = update_user(current_user, account_update_params)
    if resource_updated
      render json: current_user.to_front_end, status: 200
      return
    end
    render json: current_user.to_front_end, status: 400
  end

  protected

  def update_user(resource, params)
    if params[:password].blank?
      resource.update_without_password(params)
    else
      resource.update_with_password(params)
    end
  end

  private

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      render json: {
        success: I18n.t('devise.registrations.signed_up_but_unconfirmed'),
      }, status: 200
    else
      render json: {
        error: "User couldn't be created. #{current_user.errors.full_messages.to_sentence}"
      }, status: 422
    end
  end
end
