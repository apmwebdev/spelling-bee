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
