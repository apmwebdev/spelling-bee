class CreateUserPrefs < ActiveRecord::Migration[7.0]
  def up
    create_enum :user_color_scheme, %w[auto dark light]

    create_table :user_prefs do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
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
