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
module SbSolverScraperService
  def self.get_puzzle(id)
    return_object = {
      date: nil,
      center_letter: "",
      outer_letters: [],
      answers: [],
      sb_solver_id: id,
    }
    url = "https://www.sbsolver.com/s/#{id}"
    return_object[:sb_solver_url] = url
    doc = Nokogiri::HTML(URI::HTTPS.open(url))

    # Date
    date_string = doc.css(".bee-date a").first.text
    return_object[:date] = Date.parse(date_string)

    # Letters
    letters = []
    doc.css(".bee-medium.spacer > .thinner-space-after img").each do |node|
      letters.push(node["src"].slice(-7..-5))
    end
    letters.each do |letter_info|
      if letter_info[2] == "y"
        return_object[:center_letter] = letter_info[0]
      else
        return_object[:outer_letters].push(letter_info[0])
      end
    end

    # Answers
    doc.css(".bee-set td.bee-hover a").each do |node|
      return_object[:answers].push(node.text.downcase)
    end

    return_object
  end

  def self.write_log(to_log)
    File.write("log/sb_solver_scraper_log.txt", "#{to_log}\n", mode: "a")
  end

  def self.seed_puzzles(start_id, end_id)
    file = File.new("log/sb_solver_scraper_log.txt", "a")
    file.close
    write_log "Seed Puzzles: Starting at #{DateTime.now}"
    start_id.upto(end_id) do |id|
      write_log "Starting import for puzzle #{id}"
      if Puzzle.find_by(id:).nil?
        sleep(rand(0..2))
        puzzle_data = get_puzzle(id)
        write_log "Puzzle ID = #{id}, date = #{puzzle_data[:date]}"
        sb_solver_puzzle = SbSolverPuzzle.create({ sb_solver_id: id })
        puzzle = Puzzle.create({
          date: puzzle_data[:date],
          center_letter: puzzle_data[:center_letter],
          outer_letters: puzzle_data[:outer_letters],
          origin: sb_solver_puzzle,
        })
        puzzle_data[:answers].each do |item|
          word = Word.create_or_find_by({ text: item })
          if word.frequency.nil?
            write_log "Fetching datamuse data for \"#{item}\""
            datamuse_data = DatamuseApiService.get_word_data(item)
            word.frequency = datamuse_data[:frequency]
            word.definitions = datamuse_data[:definitions]
            word.save
          else
            write_log "Datamuse data already exists for \"#{item}\""
          end
          Answer.create({ puzzle:, word_text: item })
        end
        puzzle.create_excluded_words_cache
        write_log "Created excluded words cache"
        write_log "Finished importing puzzle #{id}"
      else
        write_log "Puzzle #{id} already exists. Moving to next puzzle."
      end
    end
  end

  def self.log_test
    1.upto(20) do |i|
      sleep(1)
      write_log(i)
    end
    write_log("blah")
    write_log("blah2")
    log_file = File.new("log/test_log.txt", "a")
    log_file.puts "Date is #{DateTime.now}"
    log_file.close
    nil
  end
end
