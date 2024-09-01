# frozen_string_literal: true

# Sets up a new dev environment from scratch
class SetUpFresh
  def initialize
    @logger = ContextualLogger.new(global_puts_only: true)
  end

  def run_setup_tasks
    # Must be done manually
    # 'rails db:create'
    # 'rails db:migrate'
    # Copy local env files from 1P
    SeedStatusTrackingOptions.seed
    SeedHintProfiles.seed_default_profiles
    seed_admin_user
    SeedHintProfiles.seed_user_profiles
    seed_from_prod
  rescue StandardError => e
    @logger.exception(e, :fatal)
  end

  def seed_admin_user
    admin = User.find_or_initialize_by({
      id: 1,
      email: "admin@admin.com",
      name: "Admin Adminson",
      encrypted_password: Devise::Encryptor.digest(User, "admin"),
      confirmed_at: DateTime.now,
    })
    admin.save!(validate: false)

    admin.create_prefs unless admin.user_pref.present?
  end

  def seed_from_prod
    service = SyncApiService.new
    service.sync_puzzles(1, page_size: 200)
    service.sync_openai_logs
  end

  def reset
    ActiveRecord::Base.connection.tables.each do |table|
      next if table == 'schema_migrations' || table == 'ar_internal_metadata'
      ActiveRecord::Base.connection.execute("TRUNCATE #{table} RESTART IDENTITY CASCADE")
    end
  end

  def hard_reset
    # Drop the DB completely. Paste this:
    # rails db:drop || (psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'spelling_bee_development' AND pid <> pg_backend_pid();" && rails db:drop)
  end

  def run_with_reset
    reset
    run_setup_tasks
  end
end
