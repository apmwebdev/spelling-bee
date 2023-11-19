# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateDefaultHintProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :default_hint_profiles do |t|
      t.string :name

      t.timestamps
    end
  end
end
