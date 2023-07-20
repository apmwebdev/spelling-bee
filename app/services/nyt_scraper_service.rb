# frozen_string_literal: true
require "open-uri"
require "nokogiri"
require "json"

module NytScraperService
  def self.write_log(to_log)
    unless File.exist?("log/nyt_scraper_log.txt")
      File.new("log/nyt_scraper_log.txt", "a").close
    end
    timestamp = DateTime.now.strftime("%Y-%m-%d %H:%M:%S")
    File.write("log/nyt_scraper_log.txt", "#{timestamp}: #{to_log}\n", mode: "a")
  end

  def self.get_puzzle_json
    doc = Nokogiri::HTML(URI.open("https://www.nytimes.com/puzzles/spelling-bee"))
    game_data = doc.css("#pz-game-root + script").text
    JSON.parse(game_data.slice(game_data.index("{")..))
  end

  def self.create_puzzle_from_json(puzzle_json)
    write_log "Starting import of puzzle for #{puzzle_json["displayDate"]}"
    nyt_puzzle = NytPuzzle.create!({nyt_id: puzzle_json["id"], json_data: puzzle_json})
    write_log "Created NytPuzzle"
    puzzle = Puzzle.create!({
      date: Date.parse(puzzle_json["displayDate"]),
      center_letter: puzzle_json["centerLetter"],
      outer_letters: puzzle_json["outerLetters"],
      origin: nyt_puzzle,
    })
    write_log "Created Puzzle. ID = #{puzzle.id}"
    puzzle_json["answers"].each do |answer|
      word = Word.create_or_find_by({text: answer})
      if word.frequency.nil?
        write_log "Fetching datamuse data for \"#{answer}\""
        datamuse_data = DatamuseApiService.get_word_data(answer)
        word.frequency = datamuse_data[:frequency]
        word.definitions = datamuse_data[:definitions]
        word.save
      else
        write_log "Datamuse data already exists for \"#{answer}\""
      end
      Answer.create!({puzzle: puzzle, word_text: answer})
    end
    write_log "Finished importing puzzle #{puzzle.id}"
  end

  def self.import_latest_puzzle
    write_log "Importing latest puzzle..."
    create_puzzle_from_json(get_puzzle_json["today"])
  end

  def self.seed_all_puzzles_json
    write_log "Seed Puzzles: Starting..."
    data = get_puzzle_json
    days_arr = [*data["pastPuzzles"]["lastWeek"]]
    days_arr.push(*data["pastPuzzles"]["thisWeek"])
    days_arr.each_with_index do |puzzle_json|
      create_puzzle_from_json(puzzle_json)
    end
  end

  def self.log_test
    write_log("test")
    write_log("test 2")
  end
end