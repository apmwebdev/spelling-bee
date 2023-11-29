class AddCurrentHintProfileUuidToUserPrefs < ActiveRecord::Migration[7.0]
  def up
    add_column :user_prefs, :current_hint_profile_uuid, :uuid
    UserPref.reset_column_information
    UserPref.find_each do |pref|
      pref.current_hint_profile_uuid = pref.current_hint_profile.uuid
    end
  end

  def down
    remove_column :user_prefs, :current_hint_profile_uuid
  end
end
