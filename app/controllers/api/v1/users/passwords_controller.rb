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
      render json: { error: "Couldn't send email" }, status: 400
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
      render json: {
        error: "Couldn't reset password",
        errorMessages: resource.errors
      }, status: 400
    end
  end
end
