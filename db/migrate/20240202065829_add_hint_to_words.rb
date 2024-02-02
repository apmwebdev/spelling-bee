class AddHintToWords < ActiveRecord::Migration[7.0]
  def change
    add_column :words, :hint, :string
  end
end
