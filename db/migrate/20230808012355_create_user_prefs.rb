# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class CreateUserPrefs < ActiveRecord::Migration[7.0]
  def up
    create_enum :user_color_scheme, %w[auto dark light]

    create_table :user_prefs do |t|
      t.references :user, null: false, foreign_key: true, index: {unique: true}
      t.enum :color_scheme, enum_type: :user_color_scheme, default: "auto", null: false
      t.references :current_hint_profile, polymorphic: true

      t.timestamps
    end
  end

  def down
    drop_table :user_prefs
    execute <<-SQL
        DROP TYPE user_color_scheme;
    SQL
  end
end
