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
  include Globals

  # Validates a value, returning true if valid and false if invalid.
  # @see #validate_type for more information.
  def valid_type?(value, type, validation_fn = nil, error_class: TypeError,
                  display_name: "value", logger_override: nil)
    validate_type(value, type, validation_fn, error_class:, display_name:, logger_override:,
      should_raise: false,)
  end

  # Validates a value, returning true if valid and raising an exception if invalid.
  # @see #validate_type for more information.
  def valid_type!(value, type, validation_fn = nil, error_class: TypeError,
                  display_name: "value", logger_override: nil)
    validate_type(value, type, validation_fn, error_class:, display_name:, logger_override:,
      should_raise: true,)
  end

  # The actual logic for type validation. Can be called manually but is meant to be called by the
  # #valid_type? and #valid_type! convenience methods. Is basic "type guard" style validation.
  # @param value [any, nil] The value to validate
  # @param type [Class, Array<Class>] value must be this class (or one of these classes) to be valid
  # @param validation_fn [Proc, nil] Additional validation lambda that value must conform to. If
  #   present, lambda must have arity of 1, use positional arguments, and return a boolean
  # @param error_class [Class<StandardError>] The error type to raise if validation fails
  # @param display_name [String] How the value should be referred to in errors/logs
  # @param logger_override [ContextualLogger, RSpec::Mocks::TestDouble] An optional ContextualLogger
  #   instance (or RSpec double mocking it) to send log messages to. This parameter is only
  #   necessary if the class including this module doesn't define its own @logger instance variable.
  # @param should_raise [Boolean] Whether this method should re-raise caught exceptions
  def validate_type(value, type, validation_fn, error_class:, display_name:, logger_override:,
                    should_raise:)
    # Argument validation
    method_logger = determine_logger!(@logger, logger_override)
    valid_asserted_type!(type)
    valid_validation_fn!(validation_fn)
    valid_should_raise!(should_raise)
    valid_error_class!(error_class)

    begin
      # Type validation
      if ((type.is_a?(Class) || type.is_a?(Module)) && !value.is_a?(type)) ||
         (type.is_a?(Array) && type.none? { |type_item| value.is_a?(type_item) })

        raise error_class, compose_failed_v8n_message(value, type, display_name)
      end

      # Additional validation
      if !value.nil? && validation_fn && !validation_fn&.call(value)
        raise error_class, "#{display_name} failed validation"
      end

      # All validation was successful
      return true
    rescue error_class => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end
  end

  # Validates the structure of a hash, returning true if valid and false if invalid.
  # @see #validate_hash
  def valid_hash?(hash, props, error_class: TypeError, display_name: "hash", logger_override: nil)
    validate_hash(hash, props, error_class:, display_name:, logger_override:, should_raise: false)
  end

  # Validates the structure of a hash, returning true if valid and raising an exception if invalid.
  # @see #validate_hash
  def valid_hash!(hash, props, error_class: TypeError, display_name: "hash", logger_override: nil)
    validate_hash(hash, props, error_class:, display_name:, logger_override:, should_raise: true)
  end

  # Tests whether a hash has certain properties, and whether those properties have the correct
  # type and (optionally) whether they pass validation.
  # @param hash [Hash] The array being tested
  # @param props [Array<Array>] An array of triples with the property key, type or array of types,
  #   and (optionally) a validation lambda
  # @param error_class (see #validate_type)
  # @param display_name (see #validate_type)
  # @param logger_override (see #validate_type)
  # @param should_raise (see #validate_type)
  #
  # @return [Boolean] True if the array is valid
  # @raise [TypeError, ArgumentError]
  def validate_hash(hash, props, error_class:, display_name:, logger_override:, should_raise:)
    method_logger = determine_logger!(@logger, logger_override)
    valid_type!(props, Array, display_name: "props", error_class: ArgumentError)
    valid_error_class!(error_class)
    valid_should_raise!(should_raise)

    begin
      valid_type!(hash, Hash, display_name:, error_class:)
    rescue error_class => e
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
      unless hash.key?(key)
        status.is_valid = false
        status.messages.push("missing key '#{key}'.")
        next
      end

      field = hash[key]
      begin
        valid_type!(field, type, validation_fn, display_name: "#{display_name}[#{key}]",
          logger_override:,)
      rescue TypeError => e
        status.is_valid = false
        status.messages.push(e.message)
      end
    end

    begin
      unless status.is_valid
        message_string = "#{display_name} invalid: #{status.messages.join('\n ')}"
        raise error_class, message_string
      end
      return true
    rescue error_class => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end
  end

  # Validates the structure of an array, returning true if valid and false if invalid.
  # @see #validate_array
  def valid_array?(array, item_class, item_validator = nil, can_be_empty: true,
                   error_class: TypeError, display_name: "array", logger_override: nil)
    validate_array(array, item_class, item_validator, can_be_empty:, error_class:, display_name:,
      logger_override:, should_raise: false,)
  end

  # Validates the structure of an array, returning true if valid and raising an exception if
  # invalid.
  # @see #validate_array
  def valid_array!(array, item_class, item_validator = nil, can_be_empty: true,
                   error_class: TypeError, display_name: "array", logger_override: nil)
    validate_array(array, item_class, item_validator, can_be_empty:, error_class:, display_name:,
      logger_override:, should_raise: true,)
  end

  # @param array [any]
  # @param item_class [Class, Array<Class>] The class or classes that all items in the array must
  #   be instances of
  # @param item_validator [Proc, nil] The lambda that validates all items in the array
  # @param can_be_empty [Boolean] Whether the array can be empty or not
  # @param error_class (see #validate_type)
  # @param display_name (see #validate_type)
  # @param logger_override (see #validate_type)
  # @param should_raise (see #validate_type)
  def validate_array(array, item_class, item_validator, can_be_empty:, error_class:, display_name:,
                     logger_override:, should_raise:)
    method_logger = determine_logger!(@logger, logger_override)
    valid_asserted_type!(item_class)
    valid_type!(item_validator, [Proc, NilClass], ->(p) { p.lambda? }, error_class: ArgumentError,
      display_name: "item_validator", logger_override:,)
    valid_type!(can_be_empty, Boolean, display_name: "can_be_empty", logger_override:)
    valid_error_class!(error_class)
    valid_should_raise!(should_raise)

    begin
      valid_type!(
        array,
        Array,
        # All array items must be the right class and must pass the validation function, if provided
        lambda do |to_test|
          to_test.all? do |array_item|
            array_item.is_a?(item_class) && (item_validator.nil? || item_validator.call(array_item))
          end
        end,
        display_name:,
        error_class:,
        logger_override: method_logger,
      )

      return true if can_be_empty
      raise error_class, "array can't be empty" if array.empty?
      return true
    rescue error_class => e
      raise e if should_raise
      method_logger&.exception e
      return false
    end
  end

  def valid_date?(date_string, error_class: TypeError, display_name: "date", logger_override: nil)
    validate_date(date_string, error_class:, display_name:, logger_override:, should_raise: false)
  end

  def valid_date!(date_string, error_class: TypeError, display_name: "date", logger_override: nil)
    validate_date(date_string, error_class:, display_name:, logger_override:, should_raise: true)
  end

  def validate_date(date_string, error_class:, display_name:, logger_override:, should_raise:)
    method_logger = determine_logger!(@logger, logger_override)
    valid_error_class!(error_class)
    valid_should_raise!(should_raise)

    begin
      Date.parse(date_string)
      return true
    rescue StandardError => e
      exception_message = "Parsing #{display_name} as Date failed. #{display_name}: "\
        "#{date_string}. Error: #{e.message}"
      log_message = "#{error_class.name}: #{exception_message}"
      raise error_class, exception_message if should_raise
      method_logger&.error log_message
      return false
    end
  end

  def valid_json?(json_string, error_class: TypeError, display_name: "json_string",
                  logger_override: nil)
    validate_json(json_string, error_class:, display_name:, logger_override:, should_raise: false)
  end

  def valid_json!(json_string, error_class: TypeError, display_name: "json_string",
                  logger_override: nil)
    validate_json(json_string, error_class:, display_name:, logger_override:, should_raise: true)
  end

  def validate_json(json_string, error_class:, display_name:, logger_override:, should_raise:)
    method_logger = determine_logger!(@logger, logger_override)
    valid_error_class!(error_class)
    valid_should_raise!(should_raise)

    begin
      JSON.parse(json_string)
      return true
    rescue JSON::ParserError, TypeError => e
      exception_message = "Parsing #{display_name} as JSON failed. #{display_name}: "\
        "#{json_string}. Error: #{e.message}"
      log_message = "#{error_class.name}: #{exception_message}"
      raise error_class, exception_message if should_raise
      method_logger&.error log_message
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

  private

  def determine_logger!(instance_logger, logger_override)
    return logger_override if class_or_double?(logger_override, ContextualLogger)
    return instance_logger if class_or_double?(instance_logger, ContextualLogger)
    raise ArgumentError, "Neither instance_logger nor logger_override are ContextualLoggers "\
      "or RSpec doubles: \n instance_logger: #{instance_logger}\n logger_override: "\
      "#{logger_override}"
  end

  # def valid_logger!(method_logger)
  #   return true if class_or_double?(method_logger, ContextualLogger)
  #   raise ArgumentError,
  #     compose_failed_v8n_message(method_logger, [ContextualLogger, DOUBLE_CLASS], "logger")
  # end

  def valid_asserted_type!(type)
    return true if type.is_a?(Class) || type.is_a?(Module) ||
                   (type.is_a?(Array) && !type.empty? &&
                     type.all? { |t| t.is_a?(Class) || t.is_a?(Module) })

    raise ArgumentError, compose_failed_v8n_message(type, [Class, Module, Array], "type")
  end

  def valid_validation_fn!(validation_fn)
    return true if validation_fn.nil? || (
      validation_fn.is_a?(Proc) && validation_fn.lambda? && validation_fn.arity == 1 &&
        validation_fn.parameters.none? { |arg_type, _| [:key, :keyreq].include?(arg_type) }
    )

    raise ArgumentError,
      compose_failed_v8n_message(validation_fn, [Proc, NilClass], "validation_fn")
  end

  def valid_should_raise!(should_raise)
    return true if should_raise.is_a?(Boolean)
    raise ArgumentError, compose_failed_v8n_message(should_raise, Boolean, "should_raise")
  end

  def valid_error_class!(error_class)
    return true if error_class.is_a?(Class) && error_class <= StandardError
    raise ArgumentError,
      compose_failed_v8n_message(error_class, "Class that is--or inherits from--StandardError",
        "error_class",)
  end

  # # @return Class<StandardError>
  # def determine_v8n_exception_type!(should_raise)
  #   valid_should_raise!(should_raise)
  #   return should_raise if should_raise.is_a?(Class) && should_raise <= StandardError
  #   return TypeError
  # end

  # def validate_type_arg!(type)
  #   return true if type.is_a?(Class) ||
  #                  (type.is_a?(Array) && !type.empty? && type.all? { |t| t.is_a?(Class) })
  #
  #   raise ArgumentError, "type must be a class or array of classes. Passed #{type}"
  # end

  def compose_failed_v8n_message(value, type, display_name = "value")
    type_string = compose_type_string(type)
    "#{display_name} must be a #{type_string} but is a #{value.class.name}: #{value}"
  end

  def compose_type_string(type)
    return type if type.is_a?(String)

    return type.name if type.is_a?(Class) || type.is_a?(Module)

    if type.is_a?(Array) && !type.empty? &&
       type.all? { |item| item.is_a?(Class) || item.is_a?(Module) }

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
