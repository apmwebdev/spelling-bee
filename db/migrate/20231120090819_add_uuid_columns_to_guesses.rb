require "securerandom"

class AddUuidColumnsToGuesses < ActiveRecord::Migration[7.0]
  def up
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")
    add_column :guesses, :uuid, :uuid, default: "gen_random_uuid()"
    add_column :guesses, :user_puzzle_attempt_uuid, :uuid
    Guess.reset_column_information

    # Backfill existing rows in guesses with UUIDs
    Guess.find_each do |guess|
      guess.update_columns(uuid: SecureRandom.uuid, user_puzzle_attempt_uuid: guess.user_puzzle_attempt.uuid)
    end

    change_column_null :guesses, :uuid, false
    change_column_null :guesses, :user_puzzle_attempt_uuid, false
    add_index :guesses, :uuid, unique: true

    add_foreign_key :guesses, :user_puzzle_attempts, column: :user_puzzle_attempt_uuid, primary_key: "uuid"
  end

  def down
    remove_foreign_key :guesses, :user_puzzle_attempts, column: :user_puzzle_attempt_uuid
    remove_column :guesses, :user_puzzle_attempt_uuid
    remove_column :guesses, :uuid
  end
end
