# frozen_string_literal: true

module WordHelper
  def words_from_strings(*slice_args, with_hints: false)
    sample_words.slice(*slice_args).map do |text|
      Word.new(text:, hint: with_hints ? "hint" : nil)
    end
  end
end

RSpec.configure do |config|
  config.include WordHelper
end
