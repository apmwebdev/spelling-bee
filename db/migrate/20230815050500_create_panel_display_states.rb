class CreatePanelDisplayStates < ActiveRecord::Migration[7.0]
  def change
    create_table :panel_display_states do |t|
      t.boolean :is_expanded, null: false, default: true
      t.boolean :is_blurred, null: false, default: true
      t.boolean :is_sticky, null: false, default: true
      t.boolean :is_settings_expanded, null: false, default: true
      t.boolean :is_settings_sticky, null: false, default: true

      t.timestamps
    end
  end
end
