class UserPuzzleAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :puzzle
  has_many :guesses
end
