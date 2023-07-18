class NYTPuzzle < ApplicationRecord
  has_one :puzzle, as: :origin
end
