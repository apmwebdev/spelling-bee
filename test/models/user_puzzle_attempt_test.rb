require "test_helper"

class UserPuzzleAttemptTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: user_puzzle_attempts
#
#  id         :bigint           not null, primary key
#  uuid       :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  puzzle_id  :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_user_puzzle_attempts_on_puzzle_id  (puzzle_id)
#  index_user_puzzle_attempts_on_user_id    (user_id)
#  index_user_puzzle_attempts_on_uuid       (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (puzzle_id => puzzles.id)
#  fk_rails_...  (user_id => users.id)
#
