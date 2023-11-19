# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateSearchPanelSearches < ActiveRecord::Migration[7.0]
  def change
    create_table :search_panel_searches do |t|
      t.references :search_panel, null: false, foreign_key: true
      t.references :user_puzzle_attempt, null: false, foreign_key: true
      t.string :search_string, null: false
      t.enum :location, enum_type: :search_panel_locations, default: "anywhere", null: false
      t.enum :output_type, enum_type: :substring_hint_output_types, default: "letters_list", null: false
      t.integer :letters_offset
      t.check_constraint "letters_offset >= 0", name: "no_negative_offset"

      t.timestamps
    end
  end
end
