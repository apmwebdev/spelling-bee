# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class MakePanelDisplayStatesFieldsNotNull < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:panel_display_states, :is_sticky, :boolean, null: false)
      change_column_null :panel_display_states, :is_expanded, false
      change_column_default :panel_display_states, :is_expanded, true
      change_column_null :panel_display_states, :is_blurred, false
      change_column_default :panel_display_states, :is_blurred, true
      change_column_null :panel_display_states, :is_sticky, false
      change_column_default :panel_display_states, :is_sticky, true
      change_column_null :panel_display_states, :is_settings_expanded, false
      change_column_default :panel_display_states, :is_settings_expanded, true
      change_column_null :panel_display_states, :is_settings_sticky, false
      change_column_default :panel_display_states, :is_settings_sticky, true
    end
  end
end
