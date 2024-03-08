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
  desc "Sync puzzles"
  # e.g. rake "sync_api:sync_latest_puzzles[2081]"
  task :sync_puzzles, [:first_puzzle_identifier] => :environment do |_t, args|
    service = SyncApiService.new
    service.logger.global_puts_and.push(:info, :warn)
    first_puzzle_identifier = args[:first_puzzle_identifier].to_i
    service.sync_puzzles(first_puzzle_identifier)
  end

  desc "Sync hints"
  task sync_hints: :environment do
    service = SyncApiService.new
    service.logger.global_puts_and.push(:info, :warn)
    service.sync_hints
  end

  desc "Send OpenAI API request instructions"
  task send_instructions: :environment do
    service = SyncApiService.new
    service.logger.global_puts_and.push(:info, :warn)
    service.send_instructions
  end

  desc "Sync OpenAI API requests and responses"
  task sync_openai_logs: :environment do
    service = SyncApiService.new
    service.logger.global_puts_and.push(:info, :warn)
    service.sync_openai_logs
  end
end
