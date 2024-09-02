# frozen_string_literal: true

# Seeds static data, which is basically DB data that could be constants instead
class StaticDataSeeder
  def initialize(logger: nil, rethrow: false)
    @logger = logger || ContextualLogger.new(global_puts_only: true)
    @rethrow = rethrow
  end

  def seed
    StatusTrackingOptionSeeder.seed
  rescue StandardError => e
    raise e if @rethrow
    @logger.exception e, :fatal
  end
end
