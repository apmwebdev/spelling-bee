class SbSolverPuzzle < ApplicationRecord
  has_one :puzzle, as: :origin
end
