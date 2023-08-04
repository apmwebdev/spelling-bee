class CreateUserPuzzleAttempts < ActiveRecord::Migration[7.0]
  def change
    create_table :user_puzzle_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :puzzle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
