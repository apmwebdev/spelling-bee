# frozen_string_literal: true

module HintPresenter
  def self.present_all_profiles(user)
    {
      userHintProfiles: user.user_hint_profiles.map { |profile| profile.to_front_end_basic },
      defaultHintProfiles: DefaultHintProfile.all.map { |profile| profile.to_front_end_complete },
    }
  end
end
