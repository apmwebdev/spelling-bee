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

# Custom message class. Like an exception, but doesn't necessarily indicate a problem. The
# purpose is to create a log message that can be logged later instead of immediately. Inherits from
# StandardError so that it can be raised, if needed.
class LogMessage < StandardError
  include BasicValidator
  include Severities

  attr_accessor :message
  attr_reader :severity, :custom_backtrace_locations

  def initialize(message, severity: :info, auto_trace: false)
    @message = message || severity
    self.severity = severity
    maybe_set_trace(auto_trace)
  end

  def severity=(value)
    @severity = parse_severity(value)
  end

  # Named with `set_` prefix for consistency with #set_backtrace
  def set_backtrace_locations(value) # rubocop:disable Naming/AccessorMethodName
    @custom_backtrace_locations = value if valid_array?(value, Thread::Backtrace::Location)
  end

  def backtrace_locations
    @custom_backtrace_locations || super
  end

  private

  def maybe_set_trace(value)
    return unless value
    set_backtrace(caller(1))
    set_backtrace_locations(caller_locations(1))
  end
end
