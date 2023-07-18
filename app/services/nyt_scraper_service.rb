# frozen_string_literal: true
require "open-uri"
require "nokogiri"
require "json"

module NytScraperService
  def self.get_puzzle_json
    doc = Nokogiri::HTML(URI.open("https://www.nytimes.com/puzzles/spelling-bee"))
    game_data = doc.css("#pz-game-root + script").text
    JSON.parse(game_data.slice(game_data.index("{")..))
  end

  def self.get_latest_puzzle_json
    get_puzzle_json["today"]
  end
end