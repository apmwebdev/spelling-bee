# frozen_string_literal: true

# Seeds an admin user for dev
class DevAdminUserSeeder
  def initialize(logger: nil, rethrow: false)
    raise StandardError, "Can only run SeedAdminUser in dev" unless Rails.env.development?

    @logger = logger || ContextualLogger.new(global_puts_only: true)
    @rethrow = rethrow
  end

  def seed!
    admin = User.find_or_initialize_by({
      id: 1,
      email: "admin@admin.com",
      name: "Admin Adminson",
      encrypted_password: Devise::Encryptor.digest(User, "admin"),
      confirmed_at: DateTime.now,
    })
    admin.save!(validate: false)

    admin.create_prefs unless admin.user_pref.present?
  rescue StandardError => e
    raise e if @rethrow
    @logger.exception e, :fatal
  end
end
