class CreateWords < ActiveRecord::Migration[7.0]
  def change
    create_table :words, id: false, primary_key: :text do |t|
      t.string :text, null: false
      t.decimal :frequency
      t.string :definitions, array: true

      t.timestamps
      t.index :text, unique: true
    end
    add_index :words, :definitions, using: "gin"
  end
end
