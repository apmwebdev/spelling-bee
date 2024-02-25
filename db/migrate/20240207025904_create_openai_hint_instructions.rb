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

# :nodoc:
class CreateOpenaiHintInstructions < ActiveRecord::Migration[7.0]
  def change
    create_table :openai_hint_instructions do |t|
      t.text :pre_word_list_text
      t.text :post_word_list_text

      t.timestamps
    end
  end
end
