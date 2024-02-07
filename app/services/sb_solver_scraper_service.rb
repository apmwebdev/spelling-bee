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

# Past puzzle data needs to be retrieved from sbsolver.com
class SbSolverScraperService
  def initialize
    @logger = ContextualLogger.new("log/sb_solver_scraper.log", "daily")
  end

  def fetch_puzzle(id)
    @logger.info "Starting import for puzzle #{id}"
    # Data to be returned to the calling method
    data = {
      date: nil,
      center_letter: nil,
      outer_letters: [],
      answers: [],
      sb_solver_id: id,
      error: nil,
    }

    handle_error = lambda do |message|
      data[:error] = message
      @logger.fatal(message)
    end

    url = "https://www.sbsolver.com/s/#{id}"
    data[:sb_solver_url] = url

    # Fetch HTML
    begin
      doc = Nokogiri::HTML(URI.open(url))
    rescue OpenURI::HTTPError => e
      handle_error.call "The request failed with HTTP error: #{e.message}"
    rescue SocketError => e
      handle_error.call "Could not connect to the server: #{e.message}"
    rescue StandardError => e
      handle_error.call "An error occurred: #{e.message}"
    end
    return data unless data[:error].nil?

    # Parse date
    begin
      date_string_element = doc.css(".bee-date a").first if doc
      raise StandardError, "Date element not found" unless date_string_element

      date_string = date_string_element.text
      data[:date] = Date.parse(date_string)
    rescue ArgumentError => e
      handle_error.call "Failed to parse date: #{e.message}"
    rescue StandardError => e
      handle_error.call(e.message)
    end

    # Parse letters
    letters = []
    doc.css(".bee-medium.spacer > .thinner-space-after img").each do |node|
      letters.push(node["src"].slice(-7..-5))
    end
    if letters.empty? || letters.length != 7
      handle_error.call "Can't find letters. letters = #{letters}"
      return data
    end

    letters.each do |letter_info|
      if letter_info[2] == "y"
        data[:center_letter] = letter_info[0]
      else
        data[:outer_letters].push(letter_info[0])
      end
    end
    if data[:center_letter].nil? || data[:outer_letters].length != 6
      msg = "Invalid letter data. center_letter = #{data[:center_letter]}, "
      msg += "outer_letters = #{data[:outer_letters]}"
      handle_error.call msg
      return data
    end

    # Answers
    doc.css(".bee-set td.bee-hover a").each do |node|
      data[:answers].push(node.text.downcase)
    end
    if data[:answers].empty?
      handle_error.call "Can't find answers: #{data[:answers]}"
      return data
    end

    data
  end

  def seed_puzzles(start_id, end_id)
    @logger.info "Import puzzles between IDs #{start_id} and #{end_id}, inclusive"

    start_id.upto(end_id) do |id|
      @logger.info "Starting loop iteration, id = #{id}"
      unless Puzzle.find_by(id:).nil?
        @logger.info "Puzzle #{id} already exists. Skipping."
        next
      end

      # Don't overwhelm the SB Solver site
      sleep(rand(0..2))
      puzzle_data = fetch_puzzle(id)
      unless puzzle_data[:error].nil?
        @logger.fatal "Error fetching data for puzzle #{id}: #{puzzle_data[:error]}. Exiting."
        break
      end

      @logger.info "Puzzle ID = #{id}, date = #{puzzle_data[:date]}"
      sb_solver_puzzle = SbSolverPuzzle.create({ sb_solver_id: id })
      puzzle = Puzzle.create!({
        date: puzzle_data[:date],
        center_letter: puzzle_data[:center_letter],
        outer_letters: puzzle_data[:outer_letters],
        origin: sb_solver_puzzle,
      })

      puzzle_data[:answers].each do |item|
        word = Word.create_or_find_by({ text: item })
        unless word.frequency.nil?
          @logger.info "Datamuse data already exists for \"#{item}\""
          next
        end

        @logger.info "Fetching datamuse data for \"#{item}\""
        datamuse_data = DatamuseApiService.get_word_data(item)
        word.frequency = datamuse_data[:frequency]
        word.definitions = datamuse_data[:definitions]
        word.save!
        Answer.create!({ puzzle:, word_text: item })
      end

      puzzle.create_excluded_words_cache
      @logger.info "Created excluded words cache"
      @logger.info "Finished importing puzzle #{id}"
    end
  end
end
