# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class UserPuzzleAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle
  has_many :guesses, dependent: :destroy

  def to_front_end
    {
      id: id,
      puzzleId: puzzle_id,
      guesses: guesses.map do |guess|
        guess.to_front_end
      end
    }
  end
end
