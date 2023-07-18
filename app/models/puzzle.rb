class Puzzle < ApplicationRecord
  belongs_to :origin, polymorphic: true
  has_many :answers
  has_many :words, through: :answers
end
