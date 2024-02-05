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

# Base class for creating validators for services that integrate external APIs.
class ExternalServiceValidatorBase

  def initialize(logger)
    unless logger.is_a?(ContextualLogger)
      raise StandardError, "Logger passed to ExternalServiceValidator must be a ContextualLogger"
    end
    @logger = logger
  end

  # def err_log(to_log)
  #   err_msg = "Invalid JSON:"
  #   @logger.error "#{err_msg} #{to_log}"
  # end

  # Tests whether a JSON hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param [Hash] object The object being tested
  # @param [String] object_name How the object being tested should be referred to in error messages
  # @param [Symbol, String] method_name How the method invoking this method should be referred to in error messages
  # @param [Array<Array>] props An array of triples with the property key, type, and (optionally) a validation lambda
  # @return [Boolean] True if the object is valid, false otherwise
  def hash_properties_are_valid?(object:, object_name:, method_name:, props:)
    method_logger = @logger.with_method("#{self.class.name}##{method_name} hash_properties_are_valid?")
    unless object.is_a?(Hash)
      method_logger.error "#{object_name} is not a hash."
      return false
    end

    unless props.is_a?(Array)
      method_logger.error "Invalid props array. props = #{[props]}"
      return false
    end

    # For some validations, we want to keep going even if the property is invalid, so we need to
    # track the validity of the object in a boolean.
    is_valid = true
    props.each do |prop|
      key = prop[0]
      type = prop[1]
      validation_fn = prop[2]
      unless object.key?(key)
        method_logger.error "#{object_name} doesn't contain key '#{key}'."
        is_valid = false
        next
      end

      unless object[key].is_a?(type)
        method_logger.error "#{object_name}['#{key}'] isn't a #{type}: #{object[key]}"
        is_valid = false
        next
      end

      if validation_fn && !validation_fn.call(object[key])
        method_logger.error "#{object_name}['#{key}'] didn't pass validation."
        is_valid = false
      end
    end
    is_valid
  end

  def valid_date?(date_string)
    method_logger = @logger.with_method("#{self.class.name}##{__method__}")
    Date.parse(date_string)
    true
  rescue ArgumentError => e
    method_logger.error "Invalid date format: #{date_string}. Error: #{e.message}"
    false
  end

  def valid_json?(json_string)
    method_logger = @logger.with_method("#{self.class.name}##{__method__}")
    JSON.parse(json_string)
    true
  rescue JSON::ParserError, TypeError => e
    method_logger.error "Invalid JSON: #{e.message}"
    false
  end
end
