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

# Class for making it easier to test BasicValidator's `valid_type?` method, accomplished by:
# 1. Providing a class that can be instantiated to run the method, since it is an instance method
# 2. Maintaining the state of the method's arguments. The method has no state, so each argument
#    would need to be passed in for each call. This would get tedious with testing, as most of
#    the arguments remain the same between any given test or test group. This class allows for
#    state to be maintained across tests so that only the arguments that change need to be
#    specified.
class BasicValidatorHelper
  include BasicValidator

  DEFAULT_DISPLAY_NAME = "value"
  DEFAULT_SHOULD_RAISE = true
  DEFAULT_ERROR_CLASS = TypeError
  EXCLUDE_ARG = :exclude
  NAMED_ARGS = [:display_name, :error_class, :logger_override].freeze

  # For testing a class that has no @logger instance variable at all, not just a nil one
  class NoLogger
    include BasicValidator
  end

  # Arguments can be set individually, with no validation, to allow for maximum flexibility in
  # testing.
  attr_accessor :logger, :value, :type, :validation_fn, :display_name,
    :error_class, :logger_override

  def initialize(value: nil, type: nil, validation_fn: nil, display_name: DEFAULT_DISPLAY_NAME,
                 logger: nil, error_class: DEFAULT_ERROR_CLASS, logger_override: nil)
    reset_all(logger:, value:, type:, validation_fn:, display_name:,
      error_class:, logger_override:,)
  end

  # Reset all the values to their defaults, or pass in any number of custom values to override the
  # defaults. Good for resetting between tests.
  def reset_all(logger: nil, value: nil, type: nil, validation_fn: nil,
                display_name: DEFAULT_DISPLAY_NAME, error_class: DEFAULT_ERROR_CLASS,
                logger_override: nil)
    @logger = logger
    @value = value
    @type = type
    @validation_fn = validation_fn
    @display_name = display_name
    @error_class = error_class
    @logger_override = logger_override
  end

  # Run #valid_type? using instance variables as args by default, but excluding args passed in
  # with EXCLUDE_ARG as the value (the `:exclude` symbol) to test what happens if arguments are not
  # included. Any argument can be overridden by passing in a non-EXCLUDE_ARG value as well.
  # @param positional_args [Array] The arguments that are sent to #valid_type? positionally, i.e.
  #   value, type, and validation_fn
  # @param named_args [Hash] The arguments that are sent to #valid_type? with names, which is all
  #   arguments except for value, type, and validation_fn.
  def run(*positional_args, **named_args)
    valid_type?(*parse_positional_args(positional_args), **parse_named_args(named_args))
  end

  # Same as #run, above, but uses #valid_type! instead of #valid_type?
  def run!(*positional_args, **named_args)
    valid_type!(*parse_positional_args(positional_args), **parse_named_args(named_args))
  end

  def parse_positional_args(args)
    return [@value, @type, @validation_fn] if !args.is_a?(Array) || args.empty?
    parsed_args = []
    return parsed_args if args[0] == EXCLUDE_ARG

    parsed_args.push(args[0])
    return parsed_args if args[1] == EXCLUDE_ARG

    parsed_args.push(args.length >= 2 ? args[1] : @type)
    return parsed_args if args[2] == EXCLUDE_ARG

    parsed_args.push(args.length >= 3 ? args[2] : @validation_fn)
    return parsed_args
  end

  def parse_named_args(args)
    NAMED_ARGS.reduce({}) do |parsed_args, key|
      unless args.key?(key)
        parsed_args[key] = instance_variable_get("@#{key}")
        next parsed_args
      end
      next parsed_args if args[key] == EXCLUDE_ARG
      parsed_args[key] = args[key]
    end
  end
end
