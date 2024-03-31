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
  desc "Sync latest puzzles starting with [id]"
  # e.g. rake "sync_api:sync_puzzles_from[2129]"
  task :sync_puzzles_from, [:first_puzzle_identifier] => :environment do |_t, args|
    first_puzzle_identifier = args[:first_puzzle_identifier].to_i
    SyncApiService.new.sync_puzzles(first_puzzle_identifier)
  end

  desc "Sync puzzles after latest"
  task sync_puzzles: :environment do
    SyncApiService.new.sync_puzzles
  end

  desc "Sync hints"
  task sync_hints: :environment do
    SyncApiService.new.sync_hints
  end

  desc "Send OpenAI API request instructions"
  task send_instructions: :environment do
    SyncApiService.new.send_instructions
  end

  desc "Sync OpenAI API requests and responses"
  task sync_openai_logs: :environment do
    SyncApiService.new.sync_openai_logs
  end
end
