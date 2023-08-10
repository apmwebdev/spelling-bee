class Guess < ApplicationRecord
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      attempt: self.user_puzzle_attempts_id,
      text:,
      isSpoiled: self.is_spoiled,
      createdAt: self.created_at,
    }
  end
end
