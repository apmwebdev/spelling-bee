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

# A correct answer for a puzzle, as determined by the puzzle creator
class Answer < ApplicationRecord
  belongs_to :puzzle
  belongs_to :word, foreign_key: :word_text

  def to_front_end
    {
      word: word_text,
      frequency: word.frequency,
      definitions: word.definitions,
      hint: word.hint,
    }
  end
end

# == Schema Information
#
# Table name: answers
#
#  id         :bigint           not null, primary key
#  puzzle_id  :bigint           not null
#  word_text  :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_answers_on_puzzle_id  (puzzle_id)
#  index_answers_on_word_text  (word_text)
#
# Foreign Keys
#
#  fk_rails_...  (puzzle_id => puzzles.id)
#  fk_rails_...  (word_text => words.text)
#
