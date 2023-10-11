# frozen_string_literal: true

class Api::V1::Users::ConfirmationsController < Devise::ConfirmationsController
  include RackSessionsFix
  respond_to :json
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end

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

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end

  private

  def resend_params
    params.require(:user).permit(:email)
  end
end
