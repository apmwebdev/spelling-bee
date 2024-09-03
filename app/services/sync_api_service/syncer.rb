# frozen_string_literal: true

module SyncApiService
  # Base class for different syncer classes. All need a logger, validator, and client
  class Syncer
    attr_reader :client, :logger, :validator

    def initialize(client: nil, logger: nil, validator: nil)
      self.logger = logger
      self.validator = validator
      self.client = client
    end

    def client=(value)
      @client = value.presence || SyncApiService::Client.new(logger:, validator:)
    end

    def logger=(value)
      @logger =
        if value.is_a?(ContextualLogger)
          value
        else
          ContextualLogger.new("log/sync_api.log", "weekly",
            global_puts_and: [:unknown, :fatal, :error, :warn, :info],)
        end
      @validator&.logger = value
    end

    def validator=(value)
      @validator =
        if value.is_a?(Validator)
          value
        else
          Validator.new(@logger)
        end
    end
  end
end
