class RemoveDeviseTokenAuthFields < ActiveRecord::Migration[7.0]
  def change
    remove_index(:users, column: [:uid, :provider])
  end
end
