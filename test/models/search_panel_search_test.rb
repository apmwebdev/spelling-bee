require "test_helper"

class SearchPanelSearchTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: search_panel_searches
#
#  id                       :bigint           not null, primary key
#  search_panel_id          :bigint           not null
#  user_puzzle_attempt_id   :bigint           not null
#  search_string            :string           not null
#  location                 :enum             default("anywhere"), not null
#  output_type              :enum             default("letters_list"), not null
#  letters_offset           :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  uuid                     :uuid             not null
#  search_panel_uuid        :uuid
#  user_puzzle_attempt_uuid :uuid
#
# Indexes
#
#  index_search_panel_searches_on_search_panel_id           (search_panel_id)
#  index_search_panel_searches_on_search_panel_uuid         (search_panel_uuid)
#  index_search_panel_searches_on_user_puzzle_attempt_id    (user_puzzle_attempt_id)
#  index_search_panel_searches_on_user_puzzle_attempt_uuid  (user_puzzle_attempt_uuid)
#  index_search_panel_searches_on_uuid                      (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (search_panel_id => search_panels.id)
#  fk_rails_...  (search_panel_uuid => search_panels.uuid)
#  fk_rails_...  (user_puzzle_attempt_id => user_puzzle_attempts.id)
#  fk_rails_...  (user_puzzle_attempt_uuid => user_puzzle_attempts.uuid)
#
