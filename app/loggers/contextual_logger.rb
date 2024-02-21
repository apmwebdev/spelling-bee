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

# Custom logger class. It extends the base Logger class in the following ways:
# - Adds method name by default to log messages
# - Allows for stack trace with log message
# - Can take StandardError objects and generate log messages for them
# - Can log to console instead of the log file on a global or per message basis
class ContextualLogger < Logger
  include Casting
  include Severities
  include BasicValidator

  attr_reader :global_puts_and, :global_puts_only, :logger

  def initialize(log_file = $stdout, log_rotation = "daily", log_level: nil,
                 global_puts_and: [:error, :fatal, :unknown], global_puts_only: false)
    # Built-in config
    options = {}
    options[:level] =
      if log_level
        parse_severity(log_level, default: :debug, as_symbol: false)
      elsif Rails.env.production?
        Logger::INFO
      else
        Logger::DEBUG
      end

    super(log_file, log_rotation, **options)

    @formatter = proc do |severity, datetime, _progname, msg|
      timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
      "#{severity} #{timestamp} - #{msg}\n"
    end

    # Custom config
    self.global_puts_and = global_puts_and
    self.global_puts_only = global_puts_only
  end

  # Tedious boilerplate logic below this line
  ################################################################################
  #

  # This is ugly, but I want autocompletion, so each severity level method is getting overridden
  # individually, with all optional parameters added explicitly.
  # @param msg [any] The message to log
  # @param starting_frame [Integer] The frame in the stack trace to start with. Default is 2 so that
  #   the frames for this logger are skipped.
  # @param standard_error [StandardError, nil] A StandardError. If present and `with_trace` and/or
  # `with_method` is true, #process_message will use the backtrace from this rather than creating a
  # new one.
  # @param with_method [Boolean] Whether to include the method name in the log message.
  # @param with_trace [Boolean] Whether to include the stack trace in the log message.
  # @param puts_only [Boolean, nil] Whether to output the message to the console (using `puts`)
  # instead of the log file. Can be nil in order to use `@global_puts_only` instead.
  # @param puts_and [Boolean, nil] Whether to output the message to the console (using `puts`)
  # in addition to the log file. Can be nil in order to use the `@global_puts_and` instead.
  def debug(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
            puts_only: nil, puts_and: nil)
    severity = :debug
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  ##
  # @param (see #debug)
  def info(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
           puts_only: nil, puts_and: nil)
    severity = :info
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  ##
  # @param (see #debug)
  def warn(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
           puts_only: nil, puts_and: nil)
    severity = :warn
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  ##
  # `with_trace` and `puts_and` are set to true by default
  # @param (see #debug)
  def error(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
            puts_only: nil, puts_and: nil)
    severity = :error
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  ##
  # @param (see #debug)
  def fatal(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
            puts_only: nil, puts_and: nil)
    severity = :fatal
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  ##
  # @param (see #debug)
  def unknown(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
              puts_only: nil, puts_and: nil)
    severity = :unknown
    message = process_message(msg, severity, starting_frame:, with_method:, with_trace:,
      standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(severity, puts_only)
  end

  #
  ################################################################################
  # Tedious boilerplate logic above this line

  ##
  # Log an error from an Exception (technically, a StandardError) object
  # @param standard_error [StandardError] The exception object to log.
  # @param severity [Symbol] The severity level for the exception. Default is :error.
  def exception(standard_error, severity = :error, additional_message: nil)
    valid_type?(standard_error, StandardError, should_raise: true, logger: self)

    valid_severity =
      if standard_error.is_a?(LogMessage)
        standard_error.severity
      else
        parse_severity(severity, default: :error, as_symbol: true)
      end
    message =
      if additional_message
        "#{standard_error.class.name}: #{additional_message}#{standard_error.message}"
      else
        "#{standard_error.class.name}: #{standard_error.message}"
      end

    send(valid_severity, message, starting_frame: 3, standard_error:)
  rescue TypeError => e
    send(:fatal, e.message, starting_frame: 0, standard_error: e)
  end

  def global_puts_and=(value)
    @global_puts_and = value if valid_puts_global?(value)
  end

  def global_puts_only=(value)
    @global_puts_only = value if valid_puts_global?(value)
  end

  private

  ##
  # Contains the bulk of the logging logic.
  # @param msg
  # @param severity [Symbol]
  # @param starting_frame [Integer]
  def process_message(msg, severity, starting_frame:, **options)
    # Prepend the method name to the log message. Default to true.
    with_method = options[:with_method] != false
    # Include stack trace. Default to false.
    with_trace = options[:with_trace] == true
    # A StandardError Exception object
    standard_error = options[:standard_error].is_a?(StandardError) ? options[:standard_error] : nil
    # Log to STDOUT instead of log file. Default to false, can be nil. If set, overrides global
    # value (@global_puts_only)
    puts_only = bool_or_nil(options[:puts_only])
    # Log to STDOUT _and_ log file. Default to false, can be nil. If set, overrides global value
    # (@global_puts_and)
    puts_and = bool_or_nil(options[:puts_and])

    message = msg.to_s
    if with_trace
      trace =
        if standard_error.is_a?(StandardError) && standard_error.backtrace.is_a?(Array)
          # Only include frames from app files, not the full stack
          standard_error.backtrace&.filter do |frame|
            frame.split("/").include?("spelling-bee")
          end
        else
          caller(starting_frame)&.filter do |frame|
            frame.split("/").include?("spelling-bee")
          end
        end
      message = "#{message}\n  #{trace.join("\n  ")}"
    end
    if with_method
      method_name =
        if standard_error.is_a?(StandardError) && standard_error.backtrace_locations.is_a?(Array)
          standard_error.backtrace_locations&.first&.base_label
        else
          caller_locations(starting_frame)[0].base_label
        end
      message = "[#{method_name}] #{message}"
    end

    maybe_puts(message, severity, puts_only, puts_and)
    return message
  end

  # Maybe output a log message to the console, based on settings
  # @param message [String]
  # @param severity [Symbol]
  # @param puts_only [Boolean, nil]
  # @param puts_and [Boolean, nil]
  def maybe_puts(message, severity, puts_only, puts_and)
    puts "#{severity.upcase} #{message}" if should_puts?(severity, puts_only, puts_and)
  end

  # Determines whether a log message should be output to the console, based on settings
  # @param severity [Symbol]
  # @param puts_only [Boolean, nil]
  # @param puts_and [Boolean, nil]
  def should_puts?(severity, puts_only, puts_and)
    error_level = parse_severity(severity, as_symbol: false)
    return false if error_level < level

    can_puts = !Rails.env.production?
    wants_puts = puts_only || puts_and || puts_only?(severity, puts_only) ||
                 puts_and?(severity, puts_and)
    return can_puts && wants_puts
  end

  # For a given message, is puts_only true or false?
  # @param severity [Symbol]
  # @param puts_only [Boolean, nil]
  def puts_only?(severity, puts_only)
    return puts_only unless puts_only.nil?
    if (@global_puts_only.is_a?(Array) && @global_puts_only.include?(severity)) ||
       @global_puts_only == true

      return true
    end
    return false
  end

  # For a given message, is puts_and true or false
  # @param severity [Symbol]
  # @param puts_and [Boolean, nil]
  def puts_and?(severity, puts_and)
    return puts_and unless puts_and.nil?
    if (@global_puts_and.is_a?(Array) && @global_puts_and.include?(severity)) ||
       @global_puts_and == true

      return true
    end
    return false
  end

  def valid_puts_global?(to_test)
    to_test == true || to_test == false ||
      valid_array?(to_test, Symbol, ->(item) { LEVEL_SYMBOLS.include?(item) }, logger: self)
  end
end
