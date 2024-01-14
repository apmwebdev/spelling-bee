# frozen_string_literal: true

class RecordInvalidError < ApiError
  def initialize(
    error_base = "",
    original_error = nil,
    active_model_errors = nil
  )
    if error_base && error_base != ""
      @message = error_base + ": "
    end
    @message += "Malformed data"
    @status = 422
    @original_error = original_error
    @active_model_errors = active_model_errors
  end
end
