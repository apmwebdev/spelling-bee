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
class CreateOpenaiHintRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :openai_hint_requests do |t|
      t.references :openai_hint_instruction, null: false, foreign_key: true,
        comment: "The instructions sent to the API about how to generate the hints for this request"
      t.string :word_list, array: true,
        comment: "The list of words sent to the API for hints"
      t.string :req_ai_model,
        comment: "The AI model requested. The 'req_' in front is to differentiate from the model"\
          "that the response says it used. These should be the same, but you never know."

      t.timestamps
    end
    add_index :openai_hint_requests, :word_list, using: "gin"
  end
end
