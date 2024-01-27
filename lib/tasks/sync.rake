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

namespace :sync_api do
  desc "Sync puzzle data"
  # e.g. rake "sync_api:sync_latest_puzzles[2081]"
  task :sync_latest_puzzles, [:first_puzzle_identifier] => :environment do |_t, args|
    first_puzzle_identifier = args[:first_puzzle_identifier]
    SyncApiService.new.sync_recent_puzzles(first_puzzle_identifier)
  end
end
