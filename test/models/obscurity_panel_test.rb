require "test_helper"

class ObscurityPanelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: obscurity_panels
#
#  id               :bigint           not null, primary key
#  click_to_define  :boolean          default(FALSE), not null
#  hide_known       :boolean          default(TRUE), not null
#  reveal_length    :boolean          default(TRUE), not null
#  revealed_letters :integer
#  separate_known   :boolean          default(FALSE), not null
#  sort_order       :enum             default("asc"), not null
#  uuid             :uuid             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_obscurity_panels_on_uuid  (uuid) UNIQUE
#
