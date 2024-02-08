require "test_helper"

class LetterPanelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: letter_panels
#
#  id                :bigint           not null, primary key
#  hide_known        :boolean          default(TRUE), not null
#  letters_offset    :integer          default(0), not null
#  location          :enum             default("start"), not null
#  number_of_letters :integer          default(1), not null
#  output_type       :enum             default("letters_list"), not null
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_letter_panels_on_uuid  (uuid) UNIQUE
#
