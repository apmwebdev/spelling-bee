class CreateGuesses < ActiveRecord::Migration[7.0]
  def change
    create_table :guesses do |t|
      t.references :user_puzzle_attempts, null: false, foreign_key: true
      t.string :text, limit: 15
      t.boolean :is_spoiled

      t.timestamps
    end
    add_index(:guesses, [:user_puzzle_attempts_id, :text], unique: true)
  end
end
