# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class AddUuidForeignKeys < ActiveRecord::Migration[7.0]
  def up
    # hint_panels - hint_profile
    add_column :hint_panels, :hint_profile_uuid, :uuid
    add_index :hint_panels, :hint_profile_uuid

    # hint_panels - initial_display_state
    add_column :hint_panels, :initial_display_state_uuid, :uuid
    add_index :hint_panels, :initial_display_state_uuid, unique: true
    add_foreign_key :hint_panels, :panel_display_states,
      column: :initial_display_state_uuid, primary_key: :uuid

    # hint_panels - panel_subtype
    add_column :hint_panels, :panel_subtype_uuid, :uuid
    add_index :hint_panels, :panel_subtype_uuid

    HintPanel.reset_column_information
    HintPanel.find_each do |panel|
      puts "Update hint panel #{panel.id}"
      panel.initial_display_state_uuid = panel.initial_display_state.uuid
      puts "Updated initial_display_state_uuid"
      panel.panel_subtype_uuid = panel.panel_subtype.uuid
      puts "Updated panel_subtype_uuid"
      panel.hint_profile_uuid = panel.hint_profile.uuid
      puts "Updated hint_profile_uuid"
      panel.save!
      puts "Saved panel"
    end

    # search_panel_searches - search_panel
    add_column :search_panel_searches, :search_panel_uuid, :uuid
    add_index :search_panel_searches, :search_panel_uuid
    add_foreign_key :search_panel_searches, :search_panels,
      column: :search_panel_uuid, primary_key: :uuid

    # search_panel_searches - user_puzzle_attempt
    add_column :search_panel_searches, :user_puzzle_attempt_uuid, :uuid
    add_index :search_panel_searches, :user_puzzle_attempt_uuid
    add_foreign_key :search_panel_searches, :user_puzzle_attempts,
      column: :user_puzzle_attempt_uuid, primary_key: :uuid

    SearchPanelSearch.reset_column_information
    SearchPanelSearch.find_each do |search|
      search.search_panel_uuid = search.search_panel.uuid
      search.user_puzzle_attempt_uuid = search.user_puzzle_attempt.uuid
      search.save!
    end

    # user_hint_profiles - default_panel_display_state
    add_column :user_hint_profiles, :default_panel_display_state_uuid, :uuid
    add_index :user_hint_profiles, :default_panel_display_state_uuid,
      unique: true
    add_foreign_key :user_hint_profiles, :panel_display_states,
      column: :default_panel_display_state_uuid, primary_key: :uuid

    UserHintProfile.reset_column_information
    UserHintProfile.find_each do |profile|
      profile.default_panel_display_state_uuid = profile.default_panel_display_state.uuid
      profile.save!
    end
  end

  def down
    remove_column :hint_panels, :hint_profile_uuid
    remove_column :hint_panels, :initial_display_state_uuid
    remove_column :hint_panels, :panel_subtype_uuid
    remove_column :search_panel_searches, :search_panel_uuid
    remove_column :search_panel_searches, :user_puzzle_attempt_uuid
    remove_column :user_hint_profiles, :default_panel_display_state_uuid
  end
end
