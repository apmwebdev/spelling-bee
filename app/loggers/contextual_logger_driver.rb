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

# Manual test driver for ContextualLogger class
class ContextualLoggerDriver
  def initialize
    @logger = ContextualLogger.new("log/contextual_logger_driver.log", "daily")
    @logger.global_puts_only = true
  end

  def logs
    @logger.debug "Debug log entry"
    @logger.info "Info log entry"
    @logger.warn "Warn log entry"
    @logger.error "Error log entry"
    @logger.fatal "Fatal log entry"
    @logger.unknown "Unknown log entry"

    @logger.error("Error with no trace", with_trace: false)
    @logger.fatal("Fatal with no trace or method", with_trace: false, with_method: false)

    begin
      raise StandardError, "Raising an exception"
    rescue StandardError => e
      @logger.exception(e, :fatal, additional_message: "This is an additional message: ")
      raise e
    end
  end
end
