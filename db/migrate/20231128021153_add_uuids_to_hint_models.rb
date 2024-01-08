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

class AddUuidsToHintModels < ActiveRecord::Migration[7.0]
  def up
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

    # Add columns
    add_column :default_hint_profiles, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :definition_panels, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :hint_panels, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :letter_panels, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :obscurity_panels, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :panel_display_states, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :search_panels, :uuid, :uuid,
      default: "gen_random_uuid()"
    add_column :user_hint_profiles, :uuid, :uuid,
      default: "gen_random_uuid()"

    # Backfill existing records with UUIDs
    DefaultHintProfile.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    DefinitionPanel.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    HintPanel.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    LetterPanel.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    ObscurityPanel.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    PanelDisplayState.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    SearchPanel.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end
    UserHintProfile.find_each do |record|
      record.update_column(:uuid, SecureRandom.uuid) unless record.uuid.present?
    end

    # Change nullability to false
    change_column_null :default_hint_profiles, :uuid, false
    change_column_null :definition_panels, :uuid, false
    change_column_null :hint_panels, :uuid, false
    change_column_null :letter_panels, :uuid, false
    change_column_null :obscurity_panels, :uuid, false
    change_column_null :panel_display_states, :uuid, false
    change_column_null :search_panels, :uuid, false
    change_column_null :user_hint_profiles, :uuid, false

    # Add unique indexes
    add_index :default_hint_profiles, :uuid, unique: true
    add_index :definition_panels, :uuid, unique: true
    add_index :hint_panels, :uuid, unique: true
    add_index :letter_panels, :uuid, unique: true
    add_index :obscurity_panels, :uuid, unique: true
    add_index :panel_display_states, :uuid, unique: true
    add_index :search_panels, :uuid, unique: true
    add_index :user_hint_profiles, :uuid, unique: true
  end

  def down
    # Remove columns
    remove_column :default_hint_profiles, :uuid
    remove_column :definition_panels, :uuid
    remove_column :hint_panels, :uuid
    remove_column :letter_panels, :uuid
    remove_column :obscurity_panels, :uuid
    remove_column :panel_display_states, :uuid
    remove_column :search_panels, :uuid
    remove_column :user_hint_profiles, :uuid
  end
end
