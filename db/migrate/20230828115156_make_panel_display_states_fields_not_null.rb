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
