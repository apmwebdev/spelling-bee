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

# == Schema Information
#
# Table name: user_puzzle_attempts
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  puzzle_id  :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  uuid       :uuid             not null
#
# Indexes
#
#  index_user_puzzle_attempts_on_puzzle_id  (puzzle_id)
#  index_user_puzzle_attempts_on_user_id    (user_id)
#  index_user_puzzle_attempts_on_uuid       (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (puzzle_id => puzzles.id)
#  fk_rails_...  (user_id => users.id)
#
