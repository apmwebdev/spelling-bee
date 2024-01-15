# frozen_string_literal: true

Sentry.init do |config|
  config.dsn = "https://266bd78da8dc1cf9f0d2e0fc5a9ae672@o4506572944900096.ingest.sentry.io/4506572948242432"
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Set traces_sample_rate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production.
  config.traces_sample_rate = 1.0
  # or
  config.traces_sampler = lambda do |context|
    true
  end
end
