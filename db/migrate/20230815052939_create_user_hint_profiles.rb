class CreateUserHintProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_hint_profiles do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true
      t.references :default_panel_tracking, type: :string, null: false, foreign_key: {to_table: :status_tracking_options, primary_key: :key}
      t.references :default_panel_display_state, null: false, foreign_key: {to_table: :panel_display_states}

      t.timestamps
    end
    rename_column :user_hint_profiles, :default_panel_tracking_id, :default_panel_tracking
  end
end
