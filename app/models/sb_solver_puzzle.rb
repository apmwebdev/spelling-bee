class SBSolverPuzzle < ApplicationRecord
  has_one :puzzle, as: :origin
end
