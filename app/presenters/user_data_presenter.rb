# frozen_string_literal: true

module UserDataPresenter
  def self.present_user_base_data(user)
    user_base_data = {
      prefs: user.user_pref.to_front_end,
      hintProfiles: HintPresenter.present_all_profiles(user),
    }
    if user.user_pref.current_hint_profile_type == "UserHintProfile"
      user_base_data[:currentUserHintProfile] = user.user_pref.current_hint_profile.to_front_end_complete
    end
    user_base_data
  end
end
