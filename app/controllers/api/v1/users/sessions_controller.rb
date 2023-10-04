# frozen_string_literal: true

class Api::V1::Users::SessionsController < Devise::SessionsController
  include RackSessionsFix
  respond_to :json

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
