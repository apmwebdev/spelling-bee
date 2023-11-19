# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateHintPanels < ActiveRecord::Migration[7.0]
  def change
    create_table :hint_panels do |t|
      t.string :name
      t.references :hint_profile, polymorphic: true, null: false
      t.references :initial_display_state, null: false, foreign_key: {to_table: :panel_display_states}
      t.references :current_display_state, null: false, foreign_key: {to_table: :panel_display_states}
      t.references :status_tracking, type: :string, null: false, foreign_key: {to_table: :status_tracking_options, primary_key: :key}
      t.references :panel_subtype, polymorphic: true, null: false
      t.integer :display_index
      t.check_constraint "display_index >= 0", name: "non_negative_display_index"

      t.timestamps
    end
    rename_column :hint_panels, :status_tracking_id, :status_tracking
  end
end
