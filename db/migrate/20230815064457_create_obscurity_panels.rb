# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateObscurityPanels < ActiveRecord::Migration[7.0]
  def change
    create_table :obscurity_panels do |t|
      t.boolean :hide_known, default: false, null: false
      t.integer :revealed_letters, default: 1, null: false
      t.check_constraint "revealed_letters > 0",
        name: "positive_revealed_letters"
      t.boolean :separate_known, default: false, null: false
      t.boolean :reveal_length, default: true, null: false
      t.boolean :click_to_define, default: false, null: false
      t.enum :sort_order, enum_type: :sort_order_options, default: "asc", null: false

      t.timestamps
    end
  end
end
