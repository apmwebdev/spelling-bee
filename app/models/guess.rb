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

# An attempt by a user to guess a puzzle answer, or an answer that a user chose to reveal
class Guess < ApplicationRecord
  include UuidRetryable
  include TimeConverter
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      uuid:,
      attemptUuid: user_puzzle_attempt_uuid,
      text:,
      createdAt: jsify_timestamp(created_at),
      isSpoiled: is_spoiled,
    }
  end
end
