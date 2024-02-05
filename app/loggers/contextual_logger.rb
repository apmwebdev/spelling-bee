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

# Custom logger class specifying a format and giving a logger_with_method class for convenience
class ContextualLogger < Logger
  def initialize(log_file, log_rotation)
    super(log_file, log_rotation)
    @formatter = proc do |severity, datetime, _progname, msg|
      timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
      "#{severity} #{timestamp} - #{msg}\n"
    end
  end

  # Allows for more informative log messages by including the method name before the main message
  # This method can be called once and assigned to a variable at the beginning of a method with the method name,
  # and then this variable can be called the same way as an instance of the logger class to log a message
  # prepended with the method name.
  # For example, assuming that this logger is stored in an instance variable called @logger:
  # @example
  #   def some_method
  #     method_logger = @logger.with_method(__method__)
  #     method_logger.info "This will print a log message prepended with the method name"
  #   end
  # @param [Symbol, String, NilClass] method_name The name of the method to display in log messages
  def with_method(method_name)
    contextual_logger = self
    logger_proxy = Object.new

    [:debug, :info, :warn, :error, :fatal, :unknown].each do |severity_method|
      logger_proxy.define_singleton_method(severity_method) do |message|
        # For :error, :fatal, and :unknown, output the message to the console as well
        full_message = "[#{method_name}] #{message}"
        puts full_message if [:error, :fatal, :unknown].include?(severity_method)
        contextual_logger.send(severity_method, full_message)
      end
    end

    logger_proxy
  end
end
