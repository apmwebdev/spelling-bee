class Puzzle < ApplicationRecord
  belongs_to :origin, polymorphic: true
end
