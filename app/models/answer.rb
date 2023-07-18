class Answer < ApplicationRecord
  belongs_to :puzzle
  belongs_to :word, foreign_key: :word_text
end
