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

# Utility functions for working with booleans
module BooleanUtils
  # Coerces a non-nil value to a boolean
  # @param value [any] The value to coerce (or return as-is if it's a Boolean or nil)
  # @param default [Boolean, nil] What the value should be coerced to if it's not a Boolean or nil
  # @return [Boolean, nil]
  def bool_or_nil(value, default: false)
    return value if value.nil? || value == true || value == false
    return default
  end

  def to_bool(value)
    !!value
  end

  def bool?(value)
    value == true || value == false # rubocop:disable Style/MultipleComparison
  end
end
