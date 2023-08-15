class CreateLetterPanels < ActiveRecord::Migration[7.0]
  def up
    create_enum :letter_panel_locations, %w[start end]

    create_table :letter_panels do |t|
      t.enum :location, enum_type: :letter_panel_locations, default: "start", null: false
      t.enum :output_type, enum_type: :substring_hint_output_types, default: "letters_list", null: false
      t.integer :number_of_letters, null: false, default: 1
      t.check_constraint "number_of_letters > 0", name: "positive_number_of_letters"
      t.integer :letters_offset, null: false, default: 0
      t.check_constraint "letters_offset >= 0", name: "no_negative_offset"
      t.boolean :show_known, null: false, default: true

      t.timestamps
    end
  end

  def down
    drop_table :letter_panels
    execute <<-SQL
        DROP TYPE letter_panel_locations;
    SQL
  end
end
