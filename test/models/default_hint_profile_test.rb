require "test_helper"

class DefaultHintProfileTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: default_hint_profiles
#
#  id         :bigint           not null, primary key
#  name       :string
#  uuid       :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_default_hint_profiles_on_uuid  (uuid) UNIQUE
#
