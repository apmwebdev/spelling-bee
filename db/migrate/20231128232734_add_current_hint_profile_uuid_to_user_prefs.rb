class AddCurrentHintProfileUuidToUserPrefs < ActiveRecord::Migration[7.0]
  def up
    add_column :user_prefs, :current_hint_profile_uuid, :uuid
    UserPref.reset_column_information
    UserPref.find_each do |pref|
      if pref.current_hint_profile
        pref.current_hint_profile_uuid = pref.current_hint_profile.uuid
        pref.save!
      elsif pref.current_hint_profile_type == "DefaultHintProfile"
        profile = DefaultHintProfile.find(pref.current_hint_profile_id)
        pref.current_hint_profile_uuid = profile.uuid
        pref.save!
      elsif pref.current_hint_profile_type == "UserHintProfile"
        profile = UserHintProfile.find(pref.current_hint_profile_id)
        pref.current_hint_profile_uuid = profile.uuid
        pref.save!
      end
    end
  end

  def down
    remove_column :user_prefs, :current_hint_profile_uuid
  end
end
