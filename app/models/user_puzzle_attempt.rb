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
  include UuidRetryable

  belongs_to :user
  belongs_to :puzzle
  has_many :guesses, dependent: :destroy
  has_many :search_panel_searches

  def to_front_end
    {
      uuid:,
      puzzleId: puzzle_id,
      createdAt: (BigDecimal(created_at.to_f.to_s) * 1000).to_i
    }
  end
end
