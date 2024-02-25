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

# == Schema Information
#
# Table name: guesses
#
#  id                       :bigint           not null, primary key
#  user_puzzle_attempt_id   :bigint           not null
#  text                     :string(15)
#  is_spoiled               :boolean
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  uuid                     :uuid             not null
#  user_puzzle_attempt_uuid :uuid             not null
#
# Indexes
#
#  index_guesses_on_user_puzzle_attempt_id           (user_puzzle_attempt_id)
#  index_guesses_on_user_puzzle_attempt_id_and_text  (user_puzzle_attempt_id,text) UNIQUE
#  index_guesses_on_uuid                             (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_puzzle_attempt_id => user_puzzle_attempts.id)
#  fk_rails_...  (user_puzzle_attempt_uuid => user_puzzle_attempts.uuid)
#
