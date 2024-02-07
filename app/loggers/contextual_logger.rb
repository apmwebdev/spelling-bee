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

# Custom logger class specifying a format and giving a `logger_with_context` logging method for
# convenience
class ContextualLogger < Logger
  LOG_LEVELS = [Logger::DEBUG, Logger::INFO, Logger::WARN, Logger::ERROR, Logger::FATAL,
    Logger::UNKNOWN,].freeze

  LEVEL_SYMBOLS = [:debug, :info, :warn, :error, :fatal, :unknown].freeze

  def initialize(log_file, log_rotation, log_level: nil)
    options = {}
    if LOG_LEVELS.include?(log_level)
      options[:level] = log_level
    elsif Rails.env.production?
      options[:level] = Logger::INFO
    end
    super(log_file, log_rotation, **options)
    @formatter = proc do |severity, datetime, _progname, msg|
      timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
      "#{severity}: #{timestamp} - #{msg}\n"
    end
  end

  # This is ugly, but I want autocompletion
  def debug(msg, with_method: true, with_trace: false, puts_only: false, puts_and: false)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  def info(msg, with_method: true, with_trace: false, puts_only: false, puts_and: false)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  def warn(msg, with_method: true, with_trace: false, puts_only: false, puts_and: false)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  # with_trace and puts_and set to true by default for error, fatal, and unknown
  def error(msg, with_method: true, with_trace: true, puts_only: false, puts_and: true)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  def fatal(msg, with_method: true, with_trace: true, puts_only: false, puts_and: true)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  def unknown(msg, with_method: true, with_trace: true, puts_only: false, puts_and: true)
    message = format_and_put(__method__, msg, with_method:, with_trace:, puts_only:, puts_and:)
    super(message) unless puts_only
  end

  ##
  # Log an error from an Exception (technically, a StandardError) object
  # @param standard_error [StandardError] The exception object to log.
  # @param severity [Symbol] The severity level for the exception. Default is :error.
  def exception(standard_error, severity = :error)
    unless standard_error.is_a?(StandardError)
      raise TypeError, "standard_error must be a StandardError: #{standard_error}"
    end

    valid_severity = LEVEL_SYMBOLS.include(severity) ? severity : :error
    message = "#{standard_error.class.name}: #{standard_error.message}"
    send(valid_severity, message)
  rescue TypeError => e
    send(:fatal, e.message)
  end

  protected

  def format_and_put(severity, msg, **options)
    # Prepend the method name to the log message. Default to true.
    with_method = options[:with_method] != false
    # Log to STDOUT instead of log file. Default to false.
    puts_only = options[:puts_only] == true
    # Include stack trace. Default to false.
    with_trace = options[:with_trace] == true
    # Log to STDOUT _and_ log file. Default to false.
    puts_and = options[:puts_and] == true
    message = msg
    # `with_trace` has higher precedence than `with_method`
    if with_trace
      # Only include frames from app files, not the full stack
      trace = caller(2).filter do |frame|
        frame.split("/").include?("spelling-bee")
      end
        .join("\n  ")
      message = "#{msg}\n  #{trace}"
    elsif with_method
      frame = caller_locations(2)[0]
      message = "[#{frame.base_label}] #{msg}"
    end
    has_stdout = !Rails.env.production?
    puts "#{severity.upcase}: #{message}" if has_stdout && (puts_only || puts_and)
    return message
  end
end
