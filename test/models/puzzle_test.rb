require "test_helper"

class PuzzleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: puzzles
#
#  id             :bigint           not null, primary key
#  center_letter  :string(1)
#  date           :date
#  excluded_words :string           is an Array
#  origin_type    :string
#  outer_letters  :string           is an Array
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  origin_id      :bigint
#
# Indexes
#
#  index_puzzles_on_excluded_words  (excluded_words) USING gin
#  index_puzzles_on_origin          (origin_type,origin_id)
#  index_puzzles_on_outer_letters   (outer_letters) USING gin
#
