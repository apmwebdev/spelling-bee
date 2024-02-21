# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

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
