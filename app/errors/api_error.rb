# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# Base class for custom errors
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
      status: @status,
    }
    response[:originalError] = @original_error&.message if @original_error
    response[:activeModelErrors] = @active_model_errors if @active_model_errors

    { apiError: response }
  end
end
