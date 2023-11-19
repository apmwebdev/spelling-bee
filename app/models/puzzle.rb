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

  attr_accessor :pangrams, :perfect_pangrams, :valid_letters, :excluded_words,
    :is_latest

  def set_valid_letters
    @valid_letters ||= [center_letter, *outer_letters].sort
  end

  def set_pangrams
    @pangrams ||= []
    return unless @pangrams.empty?
    set_valid_letters
    potential_pangrams = Answer.where(puzzle_id: id).where("length(word_text) >= 7")
    potential_pangrams.each do |pan|
      @pangrams.push(pan.word_text) if Set.new(pan.word_text.chars).length == 7
    end
    @pangrams
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

  def set_excluded_words
    set_valid_letters
    @excluded_words ||= []
    return unless @excluded_words.empty?
    Word
      .where("CHAR_LENGTH(text) >= 4")
      .where("text ~ '^[#{@valid_letters.join("")}]+$'")
      .where("text LIKE '%#{center_letter}%'")
      .find_each do |checked_word|
      unless words.include?(checked_word)
        @excluded_words.push(checked_word.text)
      end
    end
  end

  def set_is_latest
    @is_latest = Puzzle.last === self
  end

  def set_derived_fields
    set_valid_letters
    set_pangrams
    set_perfect_pangrams
    set_excluded_words
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
      excludedWords: @excluded_words,
      isLatest: @is_latest
    }
  end
end
