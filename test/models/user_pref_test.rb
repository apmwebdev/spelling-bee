require "test_helper"

class UserPrefTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: user_prefs
#
#  id                        :bigint           not null, primary key
#  user_id                   :bigint           not null
#  color_scheme              :enum             default("auto"), not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  current_hint_profile_type :string
#  current_hint_profile_id   :bigint
#  current_hint_profile_uuid :uuid
#
# Indexes
#
#  index_user_prefs_on_current_hint_profile  (current_hint_profile_type,current_hint_profile_id)
#  index_user_prefs_on_user_id               (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
