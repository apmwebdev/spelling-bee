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

namespace :scraper do
  desc "Import latest puzzle from Spelling Bee"
  task import_latest: :environment do
    NytScraperService.new.import_latest_puzzle
  end

  desc "Import all puzzle data from Spelling Bee"
  task import_all: :environment do
    NytScraperService.new.import_all_puzzles
  end

  desc "Test SbSolver #fetch_puzzle method"
  task test_sbs_fetch: :environment do
    puts SbSolverScraperService.new.fetch_puzzle(10_000)
  end

  desc "Import puzzles between ID A and B"
  # e.g. rake "scraper:import_sbs[1, 2081]"
  task :import_sbs, [:starting_id, :ending_id] => :environment do |_t, args|
    SbSolverScraperService.new.seed_puzzles(args[:starting_id].to_i, args[:ending_id].to_i)
  end
end
