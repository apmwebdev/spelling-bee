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

# Base controller for the Sync API. The Sync API is for syncing data across different instances of
# the app. This is useful for:
# 1. Making it so that word hints only need to be generated by the OpenAI API (and thus paid for)
#    once, and then can be synced to other versions of the app.
# 2. Syncing NYT puzzle data from prod to other environments. It's easier to keep the puzzles up to
#    date when there's a server with a cron job automatically fetching the new puzzles instead of a
#    human running the scraping tools manually, which is relevant when the NYT only has a record of
#    the last two weeks of puzzles.
# 3. Syncing changes to the OpenAI API hint instructions, which are stored in the database.
class SyncApi::V1::SyncApiController < ApplicationController
  before_action :authenticate_sync_api_user!

  private

  def authenticate_sync_api_user!
    error_base = "Sync API authentication failed"
    submitted_key = request.headers["Authorization"]&.split(" ")&.last
    raise ApiError.new("#{error_base}: Invalid API key", 400) unless submitted_key

    hashed_submitted_key = SyncApiService::Authenticator.hash_key(submitted_key)

    begin
      SyncApiService::Authenticator.authenticate!(hashed_submitted_key)
    rescue UnauthorizedError => e
      raise e
    rescue StandardError
      raise ApiError.new(error_base, 500)
    end
  end
end
