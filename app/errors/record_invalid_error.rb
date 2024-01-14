# frozen_string_literal: true

# Custom error type for 422 errors
class RecordInvalidError < ApiError
  def initialize(
    error_base = "",
    original_error = nil,
    active_model_errors = nil
  )
    @message = "#{error_base}: " if error_base && error_base != ""
    @message += "Malformed data"
    @status = 422
    @original_error = original_error
    @active_model_errors = active_model_errors
  end
end
