require "test_helper"

class GuessTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: guesses
#
#  id                       :bigint           not null, primary key
#  is_spoiled               :boolean
#  text                     :string(15)
#  user_puzzle_attempt_uuid :uuid             not null
#  uuid                     :uuid             not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  user_puzzle_attempt_id   :bigint           not null
#
# Indexes
#
#  index_guesses_on_user_puzzle_attempt_id           (user_puzzle_attempt_id)
#  index_guesses_on_user_puzzle_attempt_id_and_text  (user_puzzle_attempt_id,text) UNIQUE
#  index_guesses_on_uuid                             (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_puzzle_attempt_id => user_puzzle_attempts.id)
#  fk_rails_...  (user_puzzle_attempt_uuid => user_puzzle_attempts.uuid)
#
