class CreatePuzzles < ActiveRecord::Migration[7.0]
  def change
    create_table :puzzles do |t|
      t.date :date
      t.string :center_letter, limit: 1
      t.string :outer_letters, array: true
      t.references :origin, polymorphic: true

      t.timestamps
    end
    add_index :puzzles, :outer_letters, using: "gin"
  end
end
