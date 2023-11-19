# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateGuesses < ActiveRecord::Migration[7.0]
  def change
    create_table :guesses do |t|
      t.references :user_puzzle_attempt, null: false, foreign_key: true
      t.string :text, limit: 15
      t.boolean :is_spoiled

      t.timestamps
    end
    add_index(:guesses, [:user_puzzle_attempt_id, :text], unique: true)
  end
end
