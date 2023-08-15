class CreateSearchPanels < ActiveRecord::Migration[7.0]
  def up
    create_enum :search_panel_locations, %w[start end anywhere]

    create_table :search_panels do |t|
      t.enum :location, enum_type: :search_panel_locations, default: "anywhere", null: false
      t.enum :output_type, enum_type: :substring_hint_output_types, default: "letters_list", null: false
      t.integer :letters_offset, null: false, default: 0
      t.check_constraint "letters_offset >= 0", name: "no_negative_offset"

      t.timestamps
    end
  end

  def down
    drop_table :search_panels
    execute <<-SQL
        DROP TYPE search_panel_locations;
    SQL
  end
end
