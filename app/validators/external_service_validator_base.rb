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
      raise TypeError, "Logger passed to #{self.class.name} must be a ContextualLogger"
    end
    @logger = logger
  end

  # Tests whether a JSON hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param [Hash] object The object being tested
  # @param [String] display_name How the object being tested should be referred to in error messages
  # @param [Array<Array>] props An array of triples with the property key, type or array of types,
  #   and (optionally) a validation lambda
  # @return [Boolean] True if the object is valid, false otherwise
  def hash_properties_are_valid?(object, display_name:, props:)
    raise TypeError, "#{display_name} is not a hash" unless object.is_a?(Hash)

    raise TypeError, "Invalid props array. props = #{[props]}" unless props.is_a?(Array)

    # For some validations, we want to keep going even if the property is invalid, so we need to
    # track the validity of the object in a boolean.
    is_valid = true
    props.each do |prop|
      key = prop[0]
      type = prop[1]
      validation_fn = prop[2]
      unless object.key?(key)
        @logger.error "#{display_name} doesn't contain key '#{key}'."
        is_valid = false
        next
      end

      field = object[key]
      if type.is_a?(Class) && field.is_a?(type)
        @logger.error "#{display_name}['#{key}'] isn't a #{type}: #{field}"
        is_valid = false
        next
      end

      if type.is_a?(Array) && !type.include?(field.class)
        @logger.error "#{display_name}['#{key}'] isn't any of #{type}: #{field}"
        is_valid = false
        next
      end

      if !field.nil? && validation_fn && !validation_fn.call(field)
        @logger.error "#{display_name}['#{key}'] didn't pass validation."
        is_valid = false
      end
    end

    return is_valid
  rescue TypeError => e
    @logger.exception(e, :fatal)
    return false
  end

  def valid_date?(date_string)
    Date.parse(date_string)
    return true
  rescue StandardError => e
    @logger.error "#{e.class.name}: Invalid date format: #{date_string}. Error: #{e.message}"
    return false
  end

  def valid_json?(json_string)
    JSON.parse(json_string)
    return true
  rescue JSON::ParserError, TypeError => e
    @logger.error "#{e.class.name}: Invalid JSON: #{e.message}"
    return false
  end

  # @param key_list [Array]
  # @param hash [Hash]
  def keys?(key_list, hash)
    key_set = key_list.to_set
    hash_keys_set = hash.keys.to_set
    key_set.subset?(hash_keys_set)
  end
end
