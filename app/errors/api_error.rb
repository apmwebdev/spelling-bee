# frozen_string_literal: true

class ApiError < StandardError
  attr_reader :message, :status, :original_error
  attr_accessor :active_model_errors

  def initialize(
    message = "Something went wrong",
    status = 400,
    original_error = nil,
    active_model_errors = nil
  )
    @message = message
    @status = status
    @original_error = original_error
    @active_model_errors = active_model_errors
  end

  def to_front_end
    response = {
      message: @message,
      status: @status
    }
    response[:originalError] = @original_error&.message if @original_error
    response[:activeModelErrors] = @active_model_errors if @active_model_errors

    {apiError: response}
  end
end
