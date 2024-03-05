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

require_relative "../../config/environment"

# Creates fixtures for puzzle data for use in testing
module PuzzleFixtureCreator
  extend self

  PUZZLE_ROUTER = {
    1 => "puzzle_one",
    2 => "puzzle_two",
    3 => "puzzle_three",
  }.freeze

  def get_words_for_puzzle(puzzle_id)
    Word.joins(:puzzles).where(puzzles: { id: puzzle_id }).order(:text)
      .each_with_object({}) do |word, hash|
      hash[word.text] = { "text" => word.text }
    end
  end

  def export_puzzle_words
    puzzles_to_export = Puzzle.order(:id).limit(3)
    all_words = {}
    puzzles_to_export.each do |puzzle|
      all_words.merge!(get_words_for_puzzle(puzzle.id))
    end
    write_to_yaml_file(all_words, "words.yml")
  end

  def get_answers_for_puzzle(puzzle_id)
    Answer.where(puzzle_id:).order(:id).each_with_object({}) do |answer, hash|
      hash["#{answer.word_text}_answer"] = {
        "word_text" => answer.word_text,
        "puzzle_id" => puzzle_id,
      }
    end
  end

  def export_puzzle_answers
    puzzles_to_export = Puzzle.order(:id).limit(3)
    all_answers = {}
    puzzles_to_export.each do |puzzle|
      all_answers.merge!(get_answers_for_puzzle(puzzle.id))
    end
    write_to_yaml_file(all_answers, "answers.yml")
  end

  def run
    export_puzzle_words
    export_puzzle_answers
    puts "Fixtures created successfully."
  end

  private

  def write_to_yaml_file(data, filename)
    output_path = Rails.root.join("spec", "fixtures", filename)
    File.open(output_path, "w") { |file| file.write(data.to_yaml) }
  end
end

PuzzleFixtureCreator.run
