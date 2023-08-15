class CreateStatusTrackingOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :status_tracking_options, id: false, primary_key: :key do |t|
      t.string :key, null: false
      t.string :title

      t.timestamps
      t.index :key, unique: true
    end
  end
end
