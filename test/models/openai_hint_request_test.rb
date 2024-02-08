require "test_helper"

class OpenaiHintRequestTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: openai_hint_requests
#
#  id                         :bigint           not null, primary key
#  ai_model                   :string
#  word_list                  :string           is an Array
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  openai_hint_instruction_id :bigint           not null
#
# Indexes
#
#  index_openai_hint_requests_on_openai_hint_instruction_id  (openai_hint_instruction_id)
#  index_openai_hint_requests_on_word_list                   (word_list) USING gin
#
# Foreign Keys
#
#  fk_rails_...  (openai_hint_instruction_id => openai_hint_instructions.id)
#
