# frozen_string_literal: true

module UserDataPresenter
  def self.present_user_base_data(user)
    {
      prefs: user.user_pref.to_front_end,
      hintProfiles: HintPresenter.present_all_profiles(user),
      currentHintProfile: user.user_pref.current_hint_profile.to_front_end_complete,
      isLoggedIn: true
    }
  end

  def self.present_guest_base_data
    {
      prefs: nil,
      hintProfiles: HintPresenter.present_default_profiles,
      currentHintProfile: DefaultHintProfile.first.to_front_end_complete,
      isLoggedIn: false
    }
  end
end
