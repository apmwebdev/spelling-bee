class Answer < ApplicationRecord
  belongs_to :puzzle
  belongs_to :word, foreign_key: :word_text

  def to_front_end
    {
      word: word_text,
      frequency: word.frequency,
      definitions: word.definitions,
    }
  end
end
