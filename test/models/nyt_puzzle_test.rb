require "test_helper"

class NYTPuzzleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: nyt_puzzles
#
#  id         :bigint           not null, primary key
#  nyt_id     :integer
#  json_data  :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
