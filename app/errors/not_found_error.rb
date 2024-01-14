# frozen_string_literal: true

class NotFoundError < ApiError
  def initialize(
    error_base = "",
    record_type = "Record",
    original_error = nil
  )
    if error_base && error_base != ""
      @message = error_base + ": "
    end
    @message += "#{record_type} not found"
    @status = 404
    @original_error = original_error
  end
end
