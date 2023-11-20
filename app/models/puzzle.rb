# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Puzzle < ApplicationRecord
  belongs_to :origin, polymorphic: true
  has_many :answers
  has_many :words, through: :answers
  has_many :user_puzzle_attempts

  attr_accessor :pangrams, :perfect_pangrams, :valid_letters, :is_latest

  def set_valid_letters
    @valid_letters ||= [center_letter, *outer_letters].sort
  end

  def create_excluded_words_cache
    return unless excluded_words.nil?
    set_valid_letters
    valid_letters_regex = "^[#{valid_letters.join("")}]+$"
    excluded_words_array = Word
      .where("CHAR_LENGTH(text) >= 4")
      .where("text ~ ?", valid_letters_regex)
      .where("text LIKE ?", "%#{center_letter}%")
      .where.not(text: words.select(:text))
      .pluck(:text)
    update!(excluded_words: excluded_words_array)
  end

  def set_pangrams
    @pangrams ||= []
    return unless @pangrams.empty?
    set_valid_letters
    @pangrams = Answer
      .where(puzzle_id: id)
      .where("length(word_text) >= 7")
      .where(@valid_letters.map { |letter| "word_text LIKE '%#{letter}%'" }.join(" AND "))
      .pluck(:word_text)
  end

  def set_perfect_pangrams
    @perfect_pangrams ||= []
    return unless @perfect_pangrams.empty?
    set_pangrams
    @perfect_pangrams = []
    @pangrams.each do |pan_word|
      @perfect_pangrams.push(pan_word) if pan_word.length == 7
    end
    @perfect_pangrams
  end

  def set_is_latest
    @is_latest = Puzzle.last === self
  end

  def set_derived_fields
    set_valid_letters
    set_pangrams
    set_perfect_pangrams
    set_is_latest
  end

  def to_front_end
    set_derived_fields
    {
      id:,
      date:,
      centerLetter: center_letter,
      outerLetters: outer_letters,
      validLetters: @valid_letters,
      pangrams: @pangrams,
      perfectPangrams: @perfect_pangrams,
      answers: answers.map do |answer|
        answer.to_front_end
      end.sort_by { |answer| answer[:word] },
      excludedWords: excluded_words,
      isLatest: @is_latest
    }
  end
end
