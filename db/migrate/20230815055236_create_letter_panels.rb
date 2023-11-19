# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateLetterPanels < ActiveRecord::Migration[7.0]
  def up
    create_enum :letter_panel_locations, %w[start end]

    create_table :letter_panels do |t|
      t.enum :location, enum_type: :letter_panel_locations, default: "start", null: false
      t.enum :output_type, enum_type: :substring_hint_output_types, default: "letters_list", null: false
      t.integer :number_of_letters, null: false, default: 1
      t.check_constraint "number_of_letters > 0", name: "positive_number_of_letters"
      t.integer :letters_offset, null: false, default: 0
      t.check_constraint "letters_offset >= 0", name: "no_negative_offset"
      t.boolean :hide_known, null: false, default: false

      t.timestamps
    end
  end

  def down
    drop_table :letter_panels
    execute <<-SQL
        DROP TYPE letter_panel_locations;
    SQL
  end
end
