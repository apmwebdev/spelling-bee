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

  LOG_LEVELS = [Logger::DEBUG, Logger::INFO, Logger::WARN, Logger::ERROR, Logger::FATAL,
                Logger::UNKNOWN,].freeze

  attr_reader :puts_and_g, :puts_only_g

  def initialize(log_file = $stdout, log_rotation = "daily", log_level: nil,
                 puts_and_g: [:error, :fatal, :unknown], puts_only_g: false)
    # Built-in config
    options = {}
    if LOG_LEVELS.include?(log_level)
      options[:level] = log_level
    elsif Rails.env.production?
      options[:level] = Logger::INFO
    end
    super(log_file, log_rotation, **options)
    @formatter = proc do |severity, datetime, _progname, msg|
      timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
      "#{severity} #{timestamp} - #{msg}\n"
    end
    # Custom config
    @puts_and_g = puts_and_g if valid_puts_global?(puts_and_g)
    @puts_only_g = puts_only_g if valid_puts_global?(puts_only_g)
  end

  def puts_and_g=(value)
    @puts_and_g = value if valid_puts_global?(value)
  end

  def puts_only_g=(value)
    @puts_only_g = value if valid_puts_global?(value)
  end

  # This is ugly, but I want autocompletion, so each severity level method is getting overridden
  # individually, with all optional parameters added explicitly.
  # @param msg [any] The message to log
  # @param starting_frame [Integer] The frame in the stack trace to start with. Default is 2 so that
  #   the frames for this logger are skipped.
  # @param standard_error [StandardError, nil]
  # @param with_method [Boolean] Whether to include the method name in the log message.
  # @param with_trace [Boolean] Whether to include the stack trace in the log message.
  # @param puts_only [Boolean, nil] Whether to output the message to the console (using `puts`)
  # instead of the log file. Can be nil in order to use the global @puts_only_g variable instead.
  # @param puts_and [Boolean, nil] Whether to output the message to the console (using `puts`)
  # in addition to the log file. Can be nil in order to use the global @puts_and_g variable instead.
  def debug(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
            puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  def info(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
           puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  def warn(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: false,
           puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  # with_trace and puts_and set to true by default for error, fatal, and unknown
  def error(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
            puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  def fatal(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
            puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  def unknown(msg, starting_frame: 2, standard_error: nil, with_method: true, with_trace: true,
              puts_only: nil, puts_and: nil)
    message = process_message(msg, __method__, starting_frame:, with_method:, with_trace:,
                              standard_error:, puts_only:, puts_and:,)
    super(message) unless puts_only?(__method__, puts_only)
  end

  ##
  # Log an error from an Exception (technically, a StandardError) object
  # @param standard_error [StandardError] The exception object to log.
  # @param severity [Symbol] The severity level for the exception. Default is :error.
  def exception(standard_error, severity = :error, additional_message: nil)
    unless standard_error.is_a?(StandardError)
      raise TypeError, "standard_error must be a StandardError: #{standard_error}"
    end

    valid_severity = Globals::LEVEL_SYMBOLS.include?(severity) ? severity : :error
    message = if additional_message
                "#{standard_error.class.name}: #{additional_message}#{standard_error.message}"
              else
                "#{standard_error.class.name}: #{standard_error.message}"
              end

    send(valid_severity, message, starting_frame: 3, standard_error:)
  rescue TypeError => e
    send(:fatal, e.message, starting_frame: 0)
  end

  protected

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
    # value (@puts_only_g)
    puts_only = bool_or_nil(options[:puts_only])
    # Log to STDOUT _and_ log file. Default to false, can be nil. If set, overrides global value
    # (@puts_and_g)
    puts_and = bool_or_nil(options[:puts_and])

    message = msg.to_s
    if with_trace
      trace = if standard_error.is_a?(StandardError) && !standard_error.backtrace.is_a?(Array)
                standard_error.backtrace.filter do |frame|
                  frame.split("/").include?("spelling-bee")
                end
              else
                caller(starting_frame).filter do |frame|
                  frame.split("/").include?("spelling-bee")
                end
              end
      # Only include frames from app files, not the full stack
      message = "#{message}\n  #{trace.join("\n  ")}"
    end
    if with_method
      method_name = if standard_error.is_a?(StandardError) && standard_error.backtrace_locations
                      standard_error.backtrace_locations&.first&.base_label
                    else
                      caller_locations(starting_frame)[0].base_label
                    end
      message = "[#{method_name}] #{message}"
    end

    maybe_puts(message, severity, puts_only, puts_and)
    return message
  end

  ##
  #
  # @param with_trace [Boolean]
  # @param standard_error [StandardError, nil]
  # @param starting_frame [Integer]
  def maybe_set_trace(with_trace, standard_error, starting_frame)
    return nil unless with_trace

    # Only include frames from app files, not the full stack
    if standard_error.is_a?(StandardError) && !standard_error.backtrace.is_a?(Array)
      return standard_error.backtrace.filter do |frame|
        frame.split("/").include?("spelling-bee")
      end
    end

    return caller(starting_frame).filter do |frame|
      frame.split("/").include?("spelling-bee")
    end
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
    if (@puts_only_g.is_a?(Array) && @puts_only_g.include?(severity)) || @puts_only_g == true
      return true
    end
    return false
  end

  # For a given message, is puts_and true or false
  # @param severity [Symbol]
  # @param puts_and [Boolean, nil]
  def puts_and?(severity, puts_and)
    return puts_and unless puts_and.nil?
    if (@puts_and_g.is_a?(Array) && @puts_and_g.include?(severity)) || @puts_and_g == true
      return true
    end
    return false
  end

  def valid_puts_global?(to_test)
    (to_test.is_a?(Array) && to_test.all? { |item| Globals::LEVEL_SYMBOLS.include?(item) }) ||
      to_test.is_a?(TrueClass) || to_test.is_a?(FalseClass)
  end
end
