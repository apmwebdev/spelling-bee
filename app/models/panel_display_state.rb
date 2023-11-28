# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class PanelDisplayState < ApplicationRecord
  has_one :hint_panel, required: false, foreign_key: :initial_display_state_id
  has_one :hint_panel, required: false, foreign_key: :current_display_state_id
  has_one :user_hint_profile, required: false, foreign_key: :default_panel_display_state_id

  def to_front_end
    {
      uuid:,
      isExpanded: is_expanded,
      isBlurred: is_blurred,
      isSticky: is_sticky,
      isSettingsExpanded: is_settings_expanded,
      isSettingsSticky: is_settings_sticky
    }
  end
end
