require "securerandom"

class AddUuidToUserPuzzleAttempts < ActiveRecord::Migration[7.0]
  def up
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")
    add_column :user_puzzle_attempts, :uuid, :uuid, default: "gen_random_uuid()"
    UserPuzzleAttempt.reset_column_information

    # Backfill existing rows with UUIDs
    UserPuzzleAttempt.find_each do |attempt|
      attempt.update_column(:uuid, SecureRandom.uuid) unless attempt.uuid.present?
    end

    change_column_null :user_puzzle_attempts, :uuid, false
    add_index :user_puzzle_attempts, :uuid, unique: true
  end

  def down
    remove_column :user_puzzle_attempts, :uuid
  end
end
