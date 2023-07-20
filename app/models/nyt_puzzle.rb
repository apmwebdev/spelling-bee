class NytPuzzle < ApplicationRecord
  has_one :puzzle, as: :origin
end
