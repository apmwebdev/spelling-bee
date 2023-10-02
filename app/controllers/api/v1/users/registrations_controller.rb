# frozen_string_literal: true

class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionsFix
  respond_to :json

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
