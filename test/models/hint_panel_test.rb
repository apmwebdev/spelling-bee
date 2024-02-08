require "test_helper"

class HintPanelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: hint_panels
#
#  id                         :bigint           not null, primary key
#  display_index              :integer
#  hint_profile_type          :string           not null
#  hint_profile_uuid          :uuid
#  initial_display_state_uuid :uuid
#  name                       :string
#  panel_subtype_type         :string           not null
#  panel_subtype_uuid         :uuid
#  status_tracking            :string           not null
#  uuid                       :uuid             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  current_display_state_id   :bigint           not null
#  hint_profile_id            :bigint           not null
#  initial_display_state_id   :bigint           not null
#  panel_subtype_id           :bigint           not null
#
# Indexes
#
#  index_hint_panels_on_current_display_state_id    (current_display_state_id)
#  index_hint_panels_on_hint_profile                (hint_profile_type,hint_profile_id)
#  index_hint_panels_on_hint_profile_uuid           (hint_profile_uuid)
#  index_hint_panels_on_initial_display_state_id    (initial_display_state_id)
#  index_hint_panels_on_initial_display_state_uuid  (initial_display_state_uuid) UNIQUE
#  index_hint_panels_on_panel_subtype               (panel_subtype_type,panel_subtype_id)
#  index_hint_panels_on_panel_subtype_uuid          (panel_subtype_uuid)
#  index_hint_panels_on_status_tracking             (status_tracking)
#  index_hint_panels_on_uuid                        (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (current_display_state_id => panel_display_states.id)
#  fk_rails_...  (initial_display_state_id => panel_display_states.id)
#  fk_rails_...  (initial_display_state_uuid => panel_display_states.uuid)
#  fk_rails_...  (status_tracking => status_tracking_options.key)
#
