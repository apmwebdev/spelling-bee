# frozen_string_literal: true

require "open-uri"
require "nokogiri"
require "json"
require "logger"

class NytScraperService
  class NytScraperLogger < Logger
    def initialize
      super("log/nyt_scraper.log", "weekly")
      @formatter = proc do |severity, datetime, _progname, msg|
        timestamp = datetime.strftime("%Y-%m-%d %H:%M:%S")
        "#{severity} #{timestamp} - #{msg}\n"
      end
    end
  end

  def initialize
    @logger = NytScraperLogger.new
  end

  def get_puzzle_json
    doc = Nokogiri::HTML(URI.open("https://www.nytimes.com/puzzles/spelling-bee"))
    game_data = doc.css("#pz-game-root + script").text
    JSON.parse(game_data.slice(game_data.index("{")..))
  end

  def create_puzzle_from_json(puzzle_json)
    print_date = puzzle_json["printDate"]
    @logger.info "Checking DB for #{print_date} puzzle."
    puzzle_date = Date.parse(print_date)
    if Puzzle.exists?(date: puzzle_date)
      return @logger.info "Puzzle exists."
    end
    @logger.info "Puzzle not present. Starting import..."
    nyt_puzzle = NytPuzzle.create!({nyt_id: puzzle_json["id"], json_data: puzzle_json})
    @logger.info "Created NytPuzzle."
    puzzle = Puzzle.create!({
      date: puzzle_date,
      center_letter: puzzle_json["centerLetter"],
      outer_letters: puzzle_json["outerLetters"],
      origin: nyt_puzzle
    })
    @logger.info "Created Puzzle: ID = #{puzzle.id}, Date = #{print_date}."
    puzzle_json["answers"].each do |answer|
      word = Word.create_or_find_by({text: answer})
      if word.frequency.nil?
        @logger.info "Fetching datamuse data for \"#{answer}\"."
        datamuse_data = DatamuseApiService.get_word_data(answer)
        word.frequency = datamuse_data[:frequency]
        word.definitions = datamuse_data[:definitions]
        word.save
      else
        @logger.info "Datamuse data already exists for \"#{answer}\"."
      end
      Answer.create!({puzzle: puzzle, word_text: answer})
    end
    @logger.info "Finished importing puzzle #{puzzle.id} for #{print_date}"
  end

  def import_latest_puzzle
    @logger.info "Importing latest puzzle..."
    puzzles_json = get_puzzle_json
    if NytScraperValidator.new(@logger, puzzles_json).today_valid?
      create_puzzle_from_json(puzzles_json["today"])
    end
  end

  def import_all_puzzles
    @logger.info "Importing all puzzles..."
    puzzles_json = get_puzzle_json
    if NytScraperValidator.new(@logger, puzzles_json).valid?
      @days_arr = [*puzzles_json["pastPuzzles"]["lastWeek"]]
      @days_arr.push(*puzzles_json["pastPuzzles"]["thisWeek"])
      @days_arr.each do |puzzle_json|
        create_puzzle_from_json(puzzle_json)
      end
    end
  end

  def log_test
    write_log("test")
    write_log("test 2")
  end
end
