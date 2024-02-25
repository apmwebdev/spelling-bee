require "test_helper"

class UserHintProfileTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: user_hint_profiles
#
#  id                               :bigint           not null, primary key
#  name                             :string
#  user_id                          :bigint           not null
#  default_panel_tracking           :string           not null
#  default_panel_display_state_id   :bigint           not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#  uuid                             :uuid             not null
#  default_panel_display_state_uuid :uuid
#
# Indexes
#
#  index_user_hint_profiles_on_default_panel_display_state_id    (default_panel_display_state_id)
#  index_user_hint_profiles_on_default_panel_display_state_uuid  (default_panel_display_state_uuid) UNIQUE
#  index_user_hint_profiles_on_default_panel_tracking            (default_panel_tracking)
#  index_user_hint_profiles_on_user_id                           (user_id)
#  index_user_hint_profiles_on_uuid                              (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (default_panel_display_state_id => panel_display_states.id)
#  fk_rails_...  (default_panel_display_state_uuid => panel_display_states.uuid)
#  fk_rails_...  (default_panel_tracking => status_tracking_options.key)
#  fk_rails_...  (user_id => users.id)
#
