# frozen_string_literal: true
require "open-uri"
require "nokogiri"

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
    doc = Nokogiri::HTML(URI.open(url))

    # Date
    date_string = doc.css(".bee-date a").text
    return_object[:date] = Date.parse(date_string)

    # Letters
    letters = []
    doc.css(".bee-medium.spacer > .thinner-space-after img").each do |node|
      letters.push(node['src'].slice(-7..-5))
    end
    letters.each do |letterInfo|
      if letterInfo[2] == "y"
        return_object[:center_letter] = letterInfo[0]
      else
        return_object[:outer_letters].push(letterInfo[0])
      end
    end

    # Answers
    doc.css(".bee-set td.bee-hover a").each do |node|
      return_object[:answers].push(node.text.downcase)
    end

    return_object
  end

  def self.seed_puzzles(end_id)
    1.upto(end_id) do |id|
      puzzle_data = get_puzzle(id)
      sb_solver_puzzle = SbSolverPuzzle.create_or_find_by({ sb_solver_id: id })
      puzzle = Puzzle.create_or_find_by({
        date: puzzle_data[:date],
        center_letter: puzzle_data[:center_letter],
        outer_letters: puzzle_data[:outer_letters],
        origin: sb_solver_puzzle
      })
      puzzle_data[:answers].each do |item|
        word = Word.create_or_find_by({text: item})
        if word.frequency.nil?
          datamuse_data = DatamuseApiService.get_word_data(item)
          word.frequency = datamuse_data[:frequency]
          word.definitions = datamuse_data[:definitions]
          word.save
        end
        Answer.create_or_find_by({puzzle: puzzle, word_text: item})
      end
      puts "Finished importing puzzle #{id}"
    end
  end
end
