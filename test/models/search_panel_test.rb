require "test_helper"

class SearchPanelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: search_panels
#
#  id             :bigint           not null, primary key
#  location       :enum             default("anywhere"), not null
#  output_type    :enum             default("letters_list"), not null
#  letters_offset :integer          default(0), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  uuid           :uuid             not null
#
# Indexes
#
#  index_search_panels_on_uuid  (uuid) UNIQUE
#
