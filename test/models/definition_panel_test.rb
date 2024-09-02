require "test_helper"

class DefinitionPanelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: definition_panels
#
#  id               :bigint           not null, primary key
#  hide_known       :boolean          default(FALSE), not null
#  revealed_letters :integer          default(1), not null
#  reveal_length    :boolean          default(TRUE), not null
#  show_obscurity   :boolean          default(FALSE), not null
#  sort_order       :enum             default("asc"), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  separate_known   :boolean          default(TRUE), not null
#  uuid             :uuid             not null
#
# Indexes
#
#  index_definition_panels_on_uuid  (uuid) UNIQUE
#
