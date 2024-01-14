# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

require "securerandom"

# Allows a model's UUID to be regenerated and the save process to be reattempted
# in the unlikely event of a UUID collision.
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
          status: 500,
        )
      end
      self.uuid = SecureRandom.uuid
      retry
    end
  end
end
