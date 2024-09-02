# frozen_string_literal: true

# Sets up a new dev environment from scratch
class DevBootstrapper
  def initialize
    @logger = ContextualLogger.new("log/dev_bootstrapper.log", global_puts_only: true)
  end

  def run
    # Must be done manually before this:
    # `bundle install`
    # 'rails db:create'
    # 'rails db:migrate'
    # Copy local env files from 1P
    # For #seed_from_prod, you must have a sync API key
    seed_static_data
    seed_hint_profiles_and_admin_user!
    seed_from_prod
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def seed_from_prod
    service = SyncApiService.new(logger:)
    service.sync_puzzles(1, page_size: 200)
    service.sync_openai_logs
  end

  def seed_hint_profiles_and_admin_user!
    HintProfileSeeder.new(logger:).seed!(seed_user_if_needed: true)
  end

  def seed_static_data
    StaticDataSeeder.new(logger:).seed
  end

  def reset_tables
    # To drop the DB completely, run this in the terminal:
    # rails db:drop || (psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'spelling_bee_development' AND pid <> pg_backend_pid();" && rails db:drop)
    #
    tables_to_skip = %w[
      schema_migrations
      ar_internal_metadata
    ]
    ActiveRecord::Base.connection.tables.each do |table|
      next if tables_to_skip.include?(table)
      ActiveRecord::Base.connection.execute("TRUNCATE #{table} RESTART IDENTITY CASCADE")
    end
  end

  def run_with_reset
    reset_tables
    run
  end
end