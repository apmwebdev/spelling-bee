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
