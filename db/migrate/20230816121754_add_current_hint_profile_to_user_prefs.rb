class AddCurrentHintProfileToUserPrefs < ActiveRecord::Migration[7.0]
  def change
    add_reference :user_prefs, :current_hint_profile, polymorphic: true
  end
end
