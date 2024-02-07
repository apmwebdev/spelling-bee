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

require "open-uri"
require "nokogiri"
require "json"

# Scrapes puzzle data from the NYT Spelling Bee site
class NytScraperService
  def initialize
    @logger = ContextualLogger.new("log/nyt_scraper.log", "weekly")
    @validator = NytScraperValidator.new(@logger)
  end

  def fetch_puzzle_json
    doc = Nokogiri::HTML(URI.open("https://www.nytimes.com/puzzles/spelling-bee"))
    game_data = doc.css("#pz-game-root + script").text
    JSON.parse(game_data.slice(game_data.index("{")..))
  end

  def create_puzzle_from_json(puzzle_json)
    print_date = puzzle_json["printDate"]
    @logger.info "Checking DB for #{print_date} puzzle."
    puzzle_date = Date.parse(print_date)
    return @logger.info("Puzzle exists.", with_method: true) if Puzzle.exists?(date: puzzle_date)

    @logger.info "Puzzle not present. Starting import..."
    nyt_puzzle = NytPuzzle.create!({ nyt_id: puzzle_json["id"], json_data: puzzle_json })
    @logger.info "Created NytPuzzle."
    puzzle = Puzzle.create!({
      date: puzzle_date,
      center_letter: puzzle_json["centerLetter"],
      outer_letters: puzzle_json["outerLetters"],
      origin: nyt_puzzle,
    })
    @logger.info "Created Puzzle: ID = #{puzzle.id}, Date = #{print_date}."
    puzzle_json["answers"].each do |answer|
      word = Word.create_or_find_by({ text: answer })
      unless word.frequency.nil?
        @logger.info "Datamuse data already exists for \"#{answer}\"."
        next
      end
      @logger.info "Fetching datamuse data for \"#{answer}\"."
      datamuse_data = DatamuseApiService.get_word_data(answer)
      word.frequency = datamuse_data[:frequency]
      word.definitions = datamuse_data[:definitions]
      word.save!
      Answer.create!({ puzzle:, word_text: answer })
    end
    puzzle.create_excluded_words_cache
    @logger.info "Created excluded words cache"
    @logger.info "Finished importing puzzle #{puzzle.id} for #{print_date}"
  end

  def import_latest_puzzle
    @logger.info "Importing latest puzzle..."
    puzzles_json = fetch_puzzle_json
    create_puzzle_from_json(puzzles_json["today"]) if @validator.today_valid?(puzzles_json)
  end

  def import_all_puzzles
    @logger.info "Importing all puzzles..."
    puzzles_json = fetch_puzzle_json
    return unless @validator.valid?(puzzles_json)

    @days_arr = [*puzzles_json["pastPuzzles"]["lastWeek"]]
    @days_arr.push(*puzzles_json["pastPuzzles"]["thisWeek"])
    @days_arr.each do |puzzle_json|
      create_puzzle_from_json(puzzle_json)
    end
  end

  def log_test
    @logger.debug "Debug log test", puts_only: true
    @logger.info "Info log test", puts_only: true
    @logger.warn "Warning log test", puts_only: true
    @logger.error "Error log test", puts_only: true
    @logger.fatal "Fatal log test", puts_only: true
    @logger.unknown "Unknown log test", puts_only: true
  end
end
