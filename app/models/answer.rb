class Answer < ApplicationRecord
  belongs_to :puzzle
  belongs_to :word, foreign_key: :word_text

  def to_front_end
    {
      word: self.word_text,
      frequency: self.word.frequency,
      definitions: self.word.definitions,
    }
  end
end
