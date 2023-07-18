class CreateNytPuzzles < ActiveRecord::Migration[7.0]
  def change
    create_table :nyt_puzzles do |t|
      t.integer :nyt_id
      t.jsonb :json_data

      t.timestamps
    end
  end
end
