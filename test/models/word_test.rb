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
#  text        :string           not null, primary key
#  frequency   :decimal(, )
#  definitions :string           is an Array
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  hint        :string
#
# Indexes
#
#  index_words_on_definitions  (definitions) USING gin
#  index_words_on_text         (text) UNIQUE
#
