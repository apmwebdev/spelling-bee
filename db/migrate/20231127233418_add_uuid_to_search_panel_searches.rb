# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

require "securerandom"

class AddUuidToSearchPanelSearches < ActiveRecord::Migration[7.0]
  def up
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")
    add_column :search_panel_searches, :uuid, :uuid,
      default: "gen_random_uuid()"
    SearchPanelSearch.reset_column_information

    # Backfill existing records with UUIDs
    SearchPanelSearch.find_each do |search|
      search.update_column(:uuid, SecureRandom.uuid) unless search.uuid.present?
    end

    change_column_null :search_panel_searches, :uuid, false
    add_index :search_panel_searches, :uuid, unique: true
  end

  def down
    remove_column :search_panel_searches, :uuid
  end
end
