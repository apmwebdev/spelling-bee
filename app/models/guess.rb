class Guess < ApplicationRecord
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      attemptId: user_puzzle_attempt_id,
      text:,
      isSpoiled: is_spoiled,
      createdAt: created_at
    }
  end
end
