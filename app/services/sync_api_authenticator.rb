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

require "digest"

# Module for generating sync API keys and authenticating with them
module SyncApiAuthenticator
  def self.authenticate(hashed_key)
    User.find_by(sync_api_key: hashed_key)
  end

  def self.authenticate!(hashed_key)
    error_base = "Sync API authentication failed"
    User.find_by!(sync_api_key: hashed_key)
  rescue ActiveRecord::RecordNotFound
    # For security reasons, don't grab the original error
    raise UnauthorizedError, error_base
  end

  def self.generate_and_store_api_key(user)
    raw_key = generate_raw_key
    hashed_key = hash_key(raw_key)
    user.update!(sync_api_key: hashed_key)

    # Return the raw key to the user at creation time only
    raw_key
  rescue StandardError
    raise ApiError.new("Couldn't update user with sync API key", 422)
  end

  def self.hash_key(raw_key)
    Digest::SHA256.hexdigest(raw_key)
  end

  def self.generate_raw_key
    SecureRandom.urlsafe_base64(32)
  end
end
