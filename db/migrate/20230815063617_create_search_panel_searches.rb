class CreateSearchPanelSearches < ActiveRecord::Migration[7.0]
  def change
    create_table :search_panel_searches do |t|
      t.references :search_panel, null: false, foreign_key: true
      t.references :user_puzzle_attempt, null: false, foreign_key: true
      t.string :search_string, null: false
      t.enum :location, enum_type: :search_panel_locations, default: "anywhere", null: false
      t.enum :output_type, enum_type: :substring_hint_output_types, default: "letters_list", null: false
      t.integer :letters_offset
      t.check_constraint "letters_offset >= 0", name: "no_negative_offset"

      t.timestamps
    end
  end
end
