class CreatePanelDisplayStates < ActiveRecord::Migration[7.0]
  def change
    create_table :panel_display_states do |t|
      t.boolean :is_expanded
      t.boolean :is_blurred
      t.boolean :is_sticky
      t.boolean :is_settings_expanded
      t.boolean :is_settings_sticky

      t.timestamps
    end
  end
end
