# frozen_string_literal: true

# Utility functions for casting values to other types
module Casting
  # Coerces non-nil values to boolean
  # @param value [any] The value to coerce (or return as-is if it's a Boolean or nil)
  # @param default [Boolean, nil] What the value should be coerced to if it's not a Boolean or nil
  # @return [Boolean, nil]
  def bool_or_nil(value, default: false)
    return value if value.nil? || value == true || value == false
    return default
  end
end
