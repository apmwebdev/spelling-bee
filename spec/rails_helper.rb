# frozen_string_literal: true

require "spec_helper"
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
abort("The Rails environment is running in production mode!") if Rails.env.production?

require "rspec/rails"
# Add additional requires below this line. Rails is not loaded until this point!
require "webmock/rspec"
require "vcr"
Dir[Rails.root.join("spec/support/**/*.rb")].each { |file| require file }

# The 'openai-organization' header value has the format /user-[0-9a-z]{24}/
# Random part was generated with `Random.alphanumeric(24, chars: [*"0".."9", *"a".."z"])`
FAKE_USER_ID = "user-bispkxt54u8d4zj8kpa30v7x"

# VCR configuration
VCR.configure do |config|
  config.cassette_library_dir = "spec/fixtures/vcr_cassettes"
  config.hook_into :webmock
  config.configure_rspec_metadata!
  config.allow_http_connections_when_no_cassette = true
  # config.ignore_localhost = true
  config.filter_sensitive_data("<OPENAI_API_KEY>") { ENV["OPENAI_API_KEY"] }
  config.before_record do |interaction|
    # Redact the real user ID and request ID
    interaction.response.headers["Openai-Organization"] = [FAKE_USER_ID]
    interaction.response.headers["X-Request-Id"] = [SecureRandom.hex(32)]
  end
end

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = Rails.root.join("spec/fixtures")

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails can automatically mix in different behaviours to your tests based on their file
  # location. You can disable this behaviour by removing the line below, and instead  explicitly
  # tag your specs with their type. The different available types are documented in the features,
  # such as in https://rspec.info/features/6-0/rspec-rails
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!

  # Arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  # Force spec files to use `RSpec.describe` at the top level rather than just `describe`
  config.expose_dsl_globally = false
end
