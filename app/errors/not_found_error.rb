# frozen_string_literal: true

# Custom error type for 404 errors
class NotFoundError < ApiError
  def initialize(
    error_base = "",
    record_type = "Record",
    original_error = nil
  )
    @message = "#{error_base}: " if error_base && error_base != ""
    @message += "#{record_type} not found"
    @status = 404
    @original_error = original_error
  end
end
