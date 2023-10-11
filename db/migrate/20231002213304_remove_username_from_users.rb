class RemoveUsernameFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column(:users, :username, if_exists: true)
    remove_column(:users, :uid, if_exists: true)
    remove_column(:users, :provider, if_exists: true)
    remove_column(:users, :allow_password_change, if_exists: true)
    remove_column(:users, :tokens, if_exists: true)
  end
end
