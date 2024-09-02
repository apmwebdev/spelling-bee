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

require "logger"

# Seed the excluded words array for existing puzzles
class ExcludedWordSeeder
  # :nodoc:
  class ExcludedWordsSeederLogger < Logger
    def initialize
      super("log/excluded_words_seeder.log", "daily", 1024 * 1024 * 10)
      @formatter = proc do |severity, datetime, _progname, msg|
        timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
        "#{severity} #{timestamp} - #{msg}\n"
      end
    end
  end

  def initialize
    @logger = ExcludedWordsSeederLogger.new
  end

  def seed_for_puzzle(puzzle)
    @logger.info "Checking excluded words cache for puzzle #{puzzle.id}"
    return @logger.info "Cache already exists. Exiting" unless puzzle.excluded_words.nil?

    @logger.info "Creating cache"
    puzzle.create_excluded_words_cache
  end

  def test_seed
    # Test seed function on five puzzles to start out with
    Puzzle.first(5).each do |puzzle|
      seed_for_puzzle(puzzle)
    end
  end

  def seed_all
    @logger.info "Seeding excluded words caches for all existing puzzles"
    Puzzle.find_each(batch_size: 100) do |puzzle|
      seed_for_puzzle(puzzle)
    end
  end

  def delete_excluded_words
    Puzzle.where.not(excluded_words: nil).update_all(excluded_words: nil)
  end
end
