require "test_helper"

class AnswerTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: answers
#
#  id         :bigint           not null, primary key
#  puzzle_id  :bigint           not null
#  word_text  :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_answers_on_puzzle_id  (puzzle_id)
#  index_answers_on_word_text  (word_text)
#
# Foreign Keys
#
#  fk_rails_...  (puzzle_id => puzzles.id)
#  fk_rails_...  (word_text => words.text)
#
