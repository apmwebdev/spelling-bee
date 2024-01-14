# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# :nodoc:
module HintPresenter
  def self.present_all_profiles(user)
    {
      userHintProfiles: user.user_hint_profiles.map(&:to_front_end_basic),
      defaultHintProfiles: DefaultHintProfile.all.map(&:to_front_end_basic),
    }
  end

  def self.present_default_profiles
    {
      userHintProfiles: [],
      defaultHintProfiles: DefaultHintProfile.all.map(&:to_front_end_basic),
    }
  end
end
