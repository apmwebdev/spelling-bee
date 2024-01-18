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

# A user's attempt at a given puzzle. This allows users to try and solve puzzles
# multiple times, since they can have multiple UserPuzzleAttempts per puzzle
class UserPuzzleAttempt < ApplicationRecord
  include UuidRetryable
  include TimeConverter

  belongs_to :user
  belongs_to :puzzle
  has_many :guesses, dependent: :destroy
  has_many :search_panel_searches, dependent: :destroy

  def to_front_end
    {
      uuid:,
      puzzleId: puzzle_id,
      createdAt: jsify_timestamp(created_at),
    }
  end
end
