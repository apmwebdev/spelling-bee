# frozen_string_literal: true

# Load the logger gem
require 'logger'

# Define a custom logger
custom_logger = Logger.new(File.join(Rails.root, 'log', 'custom.log'))
custom_logger.level = Logger::DEBUG

# Assign the custom logger to the Rails logger
Rails.logger = custom_logger