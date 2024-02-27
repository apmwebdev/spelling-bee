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
  include BooleanUtils

  ##
  # Basic "type guard" style validation. Can either return a boolean or raise an exception.
  # @param value [any, nil] The value to validate
  # @param type [Class, Array<Class>] value must be this class (or one of these classes)
  # @param validation_fn [Proc, nil] Additional validation lambda that value must conform to. If
  #   present, lambda must have arity of 1 and use positional arguments.
  # @param display_name [String] How value should be referred to in errors/logs
  # @param should_raise [Boolean, Class<StandardError>] If boolean: whether this function should
  #   raise a TypeError if validation fails vs. just returning false. If StandardError: Raises this
  #   exception type if validation fails.
  # @param logger_override [ContextualLogger, nil] An optional ContextualLogger instance to send log
  #   messages to. This parameter is only necessary if the including class doesn't define its own
  #   @logger instance variable.
  def valid_type?(value, type, validation_fn = nil, display_name: "value", should_raise: false,
                  logger_override: nil)
    # Argument validation
    method_logger = determine_logger!(@logger, logger_override)

    unless type.is_a?(Class) ||
           (type.is_a?(Array) && !type.empty? && type.all? { |t| t.is_a?(Class) })

      raise ArgumentError, compose_failed_v8n_message(type, [Class, Array], "type")
    end

    unless validation_fn.nil? ||
           (validation_fn.is_a?(Proc) &&
             validation_fn&.lambda? &&
             validation_fn&.arity == 1 &&
             validation_fn&.parameters&.none? { |arg_type, _| [:key, :keyreq].include?(arg_type) }
           )

      raise ArgumentError, compose_failed_v8n_message(validation_fn, [Proc, NilClass],
        "validation_fn",)
    end

    v8n_exception_type = determine_v8n_exception_type!(should_raise)

    begin
      # Type validation
      if (type.is_a?(Class) && !value.is_a?(type)) ||
         (type.is_a?(Array) && !type.include?(value.class))

        raise v8n_exception_type, compose_failed_v8n_message(value, type, display_name)
      end

      # Additional validation
      if !value.nil? && validation_fn && !validation_fn&.call(value)
        raise v8n_exception_type, "#{display_name} failed validation"
      end

      # All validation was successful
      return true
    rescue v8n_exception_type => e
      raise e if should_raise

      method_logger&.exception e
      return false
    end
  end

  # Tests whether a JSON hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param object [Hash] The array being tested
  # @param props [Array<Array>] An array of triples with the property key, type or array of types,
  #   and (optionally) a validation lambda
  # @param display_name (see #valid_type?)
  # @param should_raise (see #valid_type?)
  # @param logger_override (see #valid_type?)
  #
  # @return [Boolean] True if the array is valid, false otherwise
  # @raise [TypeError, ArgumentError]
  def valid_hash?(object, props, display_name: "hash", should_raise: false, logger_override: nil)
    method_logger = determine_logger!(@logger, logger_override)
    v8n_exception_type = determine_v8n_exception_type!(should_raise)
    valid_type?(props, Array, display_name: "props", should_raise: ArgumentError)

    begin
      valid_type?(object, Hash, display_name:, should_raise: v8n_exception_type)
    rescue v8n_exception_type => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end

    # For some validations, we want to keep going even if the property is invalid, so we need to
    # track the validity of the array in a boolean.
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
          should_raise: true, logger_override:,)
      rescue TypeError => e
        status.is_valid = false
        status.messages.push(e.message)
      end
    end

    begin
      unless status.is_valid
        message_string = "#{display_name} invalid: #{status.messages.join('\n ')}"
        raise v8n_exception_type, message_string
      end
      return true
    rescue v8n_exception_type => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end
  end

  ##
  # @param [any] array
  # @param [Class] item_class The class that all items in the array must be instances of
  # @param [Proc, nil] item_validator The lambda that validates all items in the array
  # @param [String] display_name How the array should be referred to in log messages
  # @param [Boolean] should_raise Whether the method should raise a TypeError if validation fails
  #   or merely return false
  def valid_array?(array, item_class, item_validator = nil, display_name: "array",
                   can_be_empty: true, should_raise: false, logger_override: nil)
    method_logger = determine_logger!(@logger, logger_override)
    valid_type?(item_class, Class, should_raise: ArgumentError, logger_override:)
    valid_type?(item_validator, [Proc, NilClass], ->(p) { p.lambda? }, should_raise: ArgumentError,
      logger_override:,)
    v8n_exception_type = determine_v8n_exception_type!(should_raise)
    can_be_empty = to_bool(can_be_empty)

    begin
      valid_type?(
        array,
        Array,
        # All array items must be the right class and must pass the validation function, if provided
        lambda do |to_test|
          to_test.all? do |array_item|
            array_item.is_a?(item_class) && (item_validator.nil? || item_validator.call(array_item))
          end
        end,
        display_name:,
        should_raise: v8n_exception_type,
        logger_override:,
      )

      return true if can_be_empty
      raise v8n_exception_type, "array can't be empty" if array.empty?
      return true
    rescue v8n_exception_type => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end
  end

  def valid_date?(date_string, should_raise: false, logger_override: nil)
    method_logger = determine_logger!(@logger, logger_override)
    v8n_exception_type = determine_v8n_exception_type!(should_raise)
    begin
      Date.parse(date_string)
      return true
    rescue StandardError => e
      error_message = "#{e.class.name}: Invalid date format: #{date_string}. Error: #{e.message}"
      raise v8n_exception_type, error_message if should_raise
      method_logger&.error error_message
      return false
    end
  end

  def valid_json?(json_string, should_raise: false, logger_override: nil)
    method_logger = determine_logger!(@logger, logger_override)
    v8n_exception_type = determine_v8n_exception_type!(should_raise)
    begin
      JSON.parse(json_string)
      return true
    rescue JSON::ParserError, TypeError => e
      error_message = "#{e.class.name}: Invalid JSON: #{e.message}"
      raise v8n_exception_type, error_message if should_raise
      method_logger&.error error_message
      return false
    end
  end

  # @param key_list [Array]
  # @param hash [Hash]
  def keys?(key_list, hash)
    key_set = key_list.to_set
    hash_keys_set = hash.keys.to_set
    key_set.subset?(hash_keys_set)
  end

  def class_or_double?(object, valid_class)
    object.is_a?(valid_class) || object.is_a?(RSpec::Mocks::TestDouble)
  end

  private

  def determine_logger!(instance_logger, logger_override)
    return logger_override if class_or_double?(logger_override, ContextualLogger)
    return instance_logger if class_or_double?(instance_logger, ContextualLogger)
    raise ArgumentError, "Neither instance_logger nor logger_override are ContextualLoggers "\
      "or RSpec doubles: \n instance_logger: #{instance_logger}\n logger_override: "\
      "#{logger_override}"
  end

  def validate_should_raise!(should_raise)
    unless bool?(should_raise) || (should_raise.is_a?(Class) && should_raise <= StandardError)
      raise ArgumentError, "should_raise must be a boolean or a class that inherits from "\
        "StandardError but is a #{should_raise.class.name}: #{should_raise}"
    end
    return true
  end

  def determine_v8n_exception_type!(should_raise)
    validate_should_raise!(should_raise)
    return should_raise if should_raise.is_a?(Class) && should_raise <= StandardError
    return TypeError
  end

  def validate_type_arg!(type)
    return true if type.is_a?(Class) ||
                   (type.is_a?(Array) && !type.empty? && type.all? { |t| t.is_a?(Class) })

    raise ArgumentError, "type must be a class or array of classes. Passed #{type}"
  end

  def compose_failed_v8n_message(value, type, display_name = "value")
    type_string = compose_type_string(type)
    "#{display_name} must be a #{type_string} but is a #{value.class.name}: #{value}"
  end

  def compose_type_string(type)
    return type if type.is_a?(String)

    return type.name if type.is_a?(Class)

    if type.is_a?(Array) && !type.empty? && type.all? { |item| item.is_a?(Class) }
      if type.length == 1
        return type.first&.name
      elsif type.length == 2
        return "#{type.first&.name} or #{type.last&.name}"
      else
        return "#{type[0...-1]&.map(&:name)&.join(', ')}, or #{type.last&.name}"
      end
    end

    raise TypeError, "type must be a string, class or array of classes. Passed #{type}"
  end
end
