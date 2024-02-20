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

# Provides basic validation methods useful for a wide variety of classes
module BasicValidator
  def valid_type?(value, type, validation_fn = nil, display_name: "value", should_raise: false)
    @logger ||= default_logger
    unless type.is_a?(Class) ||
           (type.is_a?(Array) && !type.empty? && type.all? { |t| t.is_a?(Class) })

      raise TypeError, "type must be a class or array of classes"
    end

    unless validation_fn.nil? || (validation_fn.is_a?(Proc) && validation_fn.lambda?)
      raise TypeError, "validation_fn must be a lambda or nil"
    end

    if type.is_a?(Class) && !value.is_a?(type)
      raise TypeError, "#{display_name} must be a #{type.name} but is a #{value.class.name}: "\
        "#{value}"
    end

    if type.is_a?(Array) && !type.include?(value.class)
      type_string = if type.length < 2
                      type.first&.name
                    elsif type.length == 2
                      "#{type.first&.name} or #{type.last&.name}"
                    else
                      "#{type[0...-1].map(&:name).join(', ')}, or #{type.last&.name}"
                    end
      raise TypeError, "#{display_name} must be a #{type_string} but is a #{value.class.name}: "\
        "#{value}"
    end

    if !value.nil? && validation_fn && !validation_fn.call(value)
      raise TypeError, "#{display_name} failed validation."
    end

    return true
  rescue TypeError => e
    raise e if should_raise

    @logger.exception e
    return false
  end

  # Tests whether a JSON hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param [Hash] object The object being tested
  # @param [String] display_name How the object being tested should be referred to in error messages
  # @param [Array<Array>] props An array of triples with the property key, type or array of types,
  #   and (optionally) a validation lambda
  # @return [Boolean] True if the object is valid, false otherwise
  def valid_hash?(object, props, display_name: "hash", should_raise: false)
    @logger ||= default_logger
    raise TypeError, "#{display_name} is not a hash" unless object.is_a?(Hash)

    raise TypeError, "Invalid props array. props = #{[props]}" unless props.is_a?(Array)

    # For some validations, we want to keep going even if the property is invalid, so we need to
    # track the validity of the object in a boolean.
    status_struct = Struct.new(:is_valid, :messages)
    status = status_struct.new(true, [])
    props.each do |prop|
      key = prop[0]
      type = prop[1]
      validation_fn = prop[2]
      unless object.key?(key)
        status.is_valid = false
        status.messages.push("missing key '#{key}'.")
        next
      end

      field = object[key]
      begin
        valid_type?(field, type, validation_fn, display_name: "#{display_name}[#{key}]",
          should_raise: true,)
      rescue TypeError => e
        status.is_valid = false
        status.messages.push(e.message)
      end
    end

    unless status.is_valid
      message_string = "#{display_name} invalid: #{status.messages.join('\n ')}"
      raise TypeError, message_string
    end

    return true
  rescue TypeError => e
    raise e if should_raise
    @logger.exception e
    return false
  end

  def valid_array?(object, item_class, display_name: "object", should_raise: false)
    return valid_type?(object, Array, ->(p) { p.all? { |item| item.is_a?(item_class) } },
      display_name:, should_raise:,)
  end

  def valid_date?(date_string, should_raise: false)
    @logger ||= default_logger
    Date.parse(date_string)
    return true
  rescue StandardError => e
    error_message = "#{e.class.name}: Invalid date format: #{date_string}. Error: #{e.message}"
    raise TypeError, error_message if should_raise
    @logger.error error_message
    return false
  end

  def valid_json?(json_string, should_raise: false)
    @logger ||= default_logger
    JSON.parse(json_string)
    return true
  rescue JSON::ParserError, TypeError => e
    error_message = "#{e.class.name}: Invalid JSON: #{e.message}"
    raise TypeError, error_message if should_raise
    @logger.error error_message
    return false
  end

  # @param key_list [Array]
  # @param hash [Hash]
  def keys?(key_list, hash)
    key_set = key_list.to_set
    hash_keys_set = hash.keys.to_set
    key_set.subset?(hash_keys_set)
  end

  private

  def default_logger
    ContextualLogger.new($stdout)
  end
end
