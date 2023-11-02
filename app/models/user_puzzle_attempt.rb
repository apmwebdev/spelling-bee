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
