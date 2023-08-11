class Guess < ApplicationRecord
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      attemptId: self.user_puzzle_attempt_id,
      text:,
      isSpoiled: self.is_spoiled,
      createdAt: self.created_at,
    }
  end
end
