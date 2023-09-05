# frozen_string_literal: true

class Api::V1::Users::SessionsController < Devise::SessionsController
  include RackSessionsFix
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    render json: current_user.to_front_end, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
