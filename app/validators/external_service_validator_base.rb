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

# Base class for creating validators for services.
class ExternalServiceValidatorBase

  def initialize(logger)
    @logger = logger
  end

  def err_log(to_log)
    err_msg = "Invalid JSON:"
    @logger.error "#{err_msg} #{to_log}\n"
  end

  # Tests whether a JSON hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param [Hash] object The object being tested
  # @param [String] display_name How the object should be referred to in error messages
  # @param [Array<Array>] props An array of triples with the property key, type, and (optionally) a validation lambda
  # @return [Boolean] True if the object is valid, false otherwise
  def hash_properties_are_valid?(object, display_name, props)
    # For some validations, we want to keep going even if the property is invalid, so we need to
    # track the validity of the object.
    is_valid = true
    unless object.is_a?(Hash)
      err_log "#{display_name} is not a hash."
      # If the object isn't a hash, no need to test individual properties. Just return.
      return false
    end
    props.each do |prop|
      key = prop[0]
      type = prop[1]
      validation_fn = prop[2]
      unless object.key?(key)
        err_log "#{display_name} doesn't contain key '#{key}'."
        is_valid = false
        # No need to test the type and validation_fn of the property if it doesn't exist
        next
      end
      unless object[key].is_a?(type)
        err_log "#{display_name}['#{key}'] isn't a #{type}: #{object[key]}"
        is_valid = false
        # If the property is the wrong type, it won't pass validation, so go to next property
        next
      end
      if validation_fn && !validation_fn.call(object[key])
        err_log "#{display_name}['#{key}'] didn't pass validation."
        is_valid = false
      end
    end
    is_valid
  end

  def valid_date?(date_string)
    Date.parse(date_string)
    true
  rescue ArgumentError => e
    @logger.error "Invalid date format: #{date_string}. Error: #{e.message}"
    false
  end

  def valid_json?(json_string)
    JSON.parse(json_string)
    true
  rescue JSON::ParserError, TypeError => e
    err_log "valid_json?: Invalid JSON: #{e.message}"
    false
  end
end
