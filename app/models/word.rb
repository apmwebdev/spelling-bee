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

# A word in the English language, regardless of whether it is an answer or not.
# The definitions and frequency data are stored here.
class Word < ApplicationRecord
  self.primary_key = :text
  has_many :answers, primary_key: :text, foreign_key: :word_text
  has_many :puzzles, through: :answers

  def to_front_end
    { text:, frequency:, definitions:, hint: }
  end

  def to_sync_api
    to_front_end
  end
end

# == Schema Information
#
# Table name: words
#
#  text        :string           not null, primary key
#  frequency   :decimal(, )
#  definitions :string           is an Array
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  hint        :string
#
# Indexes
#
#  index_words_on_definitions  (definitions) USING gin
#  index_words_on_text         (text) UNIQUE
#
