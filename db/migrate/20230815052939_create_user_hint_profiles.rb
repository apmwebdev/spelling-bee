# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateUserHintProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_hint_profiles do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true
      t.references :default_panel_tracking, type: :string, null: false, foreign_key: {to_table: :status_tracking_options, primary_key: :key}
      t.references :default_panel_display_state, null: false, foreign_key: {to_table: :panel_display_states}

      t.timestamps
    end
    rename_column :user_hint_profiles, :default_panel_tracking_id, :default_panel_tracking
  end
end
