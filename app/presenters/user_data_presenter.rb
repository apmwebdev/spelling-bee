# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

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
