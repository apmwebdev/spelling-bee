# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateWords < ActiveRecord::Migration[7.0]
  def change
    create_table :words, id: false, primary_key: :text do |t|
      t.string :text, null: false
      t.decimal :frequency
      t.string :definitions, array: true

      t.timestamps
      t.index :text, unique: true
    end
    add_index :words, :definitions, using: "gin"
  end
end
