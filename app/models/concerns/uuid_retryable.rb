# frozen_string_literal: true

require "securerandom"

module UuidRetryable
  extend ActiveSupport::Concern

  class RetryLimitExceeded < StandardError; end

  def save_with_uuid_retry!(max_retries: 3)
    attempts = 0
    begin
      save!
    rescue ActiveRecord::RecordNotUnique
      attempts += 1
      raise RetryLimitExceeded if attempts >= max_retries
      self.uuid = SecureRandom.uuid
      retry
    end
  end
end
