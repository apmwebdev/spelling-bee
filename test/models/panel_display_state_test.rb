require "test_helper"

class PanelDisplayStateTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: panel_display_states
#
#  id                   :bigint           not null, primary key
#  is_expanded          :boolean          default(TRUE), not null
#  is_blurred           :boolean          default(TRUE), not null
#  is_sticky            :boolean          default(TRUE), not null
#  is_settings_expanded :boolean          default(TRUE), not null
#  is_settings_sticky   :boolean          default(TRUE), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  uuid                 :uuid             not null
#
# Indexes
#
#  index_panel_display_states_on_uuid  (uuid) UNIQUE
#
