class Word < ApplicationRecord
  self.primary_key = :text
  has_many :answers, primary_key: :text, foreign_key: :word_text
  has_many :puzzles, through: :answers
end
