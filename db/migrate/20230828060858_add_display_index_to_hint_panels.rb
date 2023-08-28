class AddDisplayIndexToHintPanels < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:hint_panels, :display_index)
      add_column :hint_panels, :display_index, :integer
      add_check_constraint :hint_panels, "display_index > 0", name: "positive_display_index"
    end
  end
end
