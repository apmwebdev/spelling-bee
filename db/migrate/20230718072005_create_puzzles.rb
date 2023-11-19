# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreatePuzzles < ActiveRecord::Migration[7.0]
  def change
    create_table :puzzles do |t|
      t.date :date
      t.string :center_letter, limit: 1
      t.string :outer_letters, array: true
      t.references :origin, polymorphic: true

      t.timestamps
    end
    add_index :puzzles, :outer_letters, using: "gin"
  end
end
