class CreateDefaultHintProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :default_hint_profiles do |t|
      t.string :name

      t.timestamps
    end
  end
end
