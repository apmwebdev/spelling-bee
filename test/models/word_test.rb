require "test_helper"

class WordTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: words
#
#  definitions :string           is an Array
#  frequency   :decimal(, )
#  hint        :string
#  text        :string           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_words_on_definitions  (definitions) USING gin
#  index_words_on_text         (text) UNIQUE
#
