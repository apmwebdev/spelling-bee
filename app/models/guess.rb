# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class Guess < ApplicationRecord
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      uuid:,
      attemptUuid: user_puzzle_attempt_uuid,
      text:,
      createdAt: created_at.to_i,
      isSpoiled: is_spoiled
    }
  end
end
