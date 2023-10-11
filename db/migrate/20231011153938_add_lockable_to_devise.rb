class AddLockableToDevise < ActiveRecord::Migration[7.0]
  def up
    add_column :users, :failed_attempts, :integer, default: 0, null: false
    add_column :users, :locked_at, :datetime

    add_column :users, :unlock_token, :string
    add_index :users, :unlock_token, unique: true
  end

  def down
    if column_exists? :users, :unlock_token
      remove_index :users, :unlock_token
      remove_column :users, :unlock_token
    end
    remove_column :users, :locked_at, if_exists: true
    remove_column :users, :failed_attempts, if_exists: true
  end
end
