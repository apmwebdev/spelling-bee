class ChangeDisplayIndexConstraint < ActiveRecord::Migration[7.0]
  def change
    remove_check_constraint :hint_panels, name: "positive_display_index"
    add_check_constraint :hint_panels, "display_index >= 0", name: "non_negative_display_index"
  end
end
