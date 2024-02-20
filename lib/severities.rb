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

# Constants and methods for dealing with log/error levels. This is needed so that either symbols
# or integers can be used to set the severity level instead of just integers.
module Severities
  LEVEL_SYMBOLS = [:debug, :info, :warn, :error, :fatal, :unknown].freeze

  LOG_LEVELS = [Logger::DEBUG, Logger::INFO, Logger::WARN, Logger::ERROR, Logger::FATAL,
    Logger::UNKNOWN,].freeze

  SEVERITIES = {
    debug: Logger::DEBUG,
    info: Logger::INFO,
    warn: Logger::WARN,
    error: Logger::ERROR,
    fatal: Logger::FATAL,
    unknown: Logger::UNKNOWN,
  }.freeze

  def parse_severity(to_parse)
    return SEVERITIES[to_parse] if SEVERITIES.key?(to_parse)
    return to_parse if SEVERITIES.value?(to_parse)
    return SEVERITIES[:info]
  end
end
