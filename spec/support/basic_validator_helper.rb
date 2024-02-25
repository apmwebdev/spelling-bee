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

  # For testing a class that has no @logger instance variable at all, not just a nil one
  class NoLogger
    include BasicValidator
  end

  attr_accessor :value, :type, :validation_fn, :display_name, :should_raise, :logger,
    :logger_override

  def initialize(value: nil, type: nil, validation_fn: nil, display_name: DEFAULT_DISPLAY_NAME,
                 should_raise: DEFAULT_SHOULD_RAISE, logger: nil, logger_override: nil)
    reset_all(value:, type:, validation_fn:, display_name:, should_raise:, logger:,
      logger_override:,)
  end

  def reset_all(value: nil, type: nil, validation_fn: nil, display_name: DEFAULT_DISPLAY_NAME,
                should_raise: DEFAULT_SHOULD_RAISE, logger: nil, logger_override: nil)
    @value = value
    @type = type
    @validation_fn = validation_fn
    @display_name = display_name
    @should_raise = should_raise
    @logger = logger
    @logger_override = logger_override
  end

  ##
  # Run the #valid_type? method of BasicValidator.
  # @param p_one_offs [Array]
  def run(*p_one_offs, **n_one_offs)
    run_value = p_one_offs.length.positive? ? p_one_offs[0] : @value
    run_type = p_one_offs.length >= 2 ? p_one_offs[1] : @type
    run_validation_fn = p_one_offs.length >= 3 ? p_one_offs[2] : @validation_fn
    run_display_name = n_one_offs.key?(:display_name) ? n_one_offs[:display_name] : @display_name
    run_should_raise = n_one_offs.key?(:should_raise) ? n_one_offs[:should_raise] : @should_raise
    run_logger_override =
      if n_one_offs.key?(:logger_override)
        n_one_offs[:logger_override]
      else
        @logger_override
      end
    valid_type?(run_value, run_type, run_validation_fn, display_name: run_display_name,
      should_raise: run_should_raise, logger_override: run_logger_override,)
  end
end
