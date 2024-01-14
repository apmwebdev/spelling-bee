# frozen_string_literal: true

require "securerandom"

module UuidRetryable
  extend ActiveSupport::Concern

  class RetryLimitExceeded < ApiError; end

  def save_with_uuid_retry!(max_retries: 3)
    attempts = 0
    begin
      save!
    rescue ActiveRecord::RecordNotUnique
      attempts += 1
      if attempts >= max_retries
        raise RetryLimitExceeded.new(
          message: "Could not save #{self.class.name}: Retry limit exceeded",
          status: 500
        )
      end
      self.uuid = SecureRandom.uuid
      retry
    end
  end
end
