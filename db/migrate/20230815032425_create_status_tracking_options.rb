# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateStatusTrackingOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :status_tracking_options, id: false, primary_key: :key do |t|
      t.string :key, null: false
      t.string :title

      t.timestamps
      t.index :key, unique: true
    end
  end
end
