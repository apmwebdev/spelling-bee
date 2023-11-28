# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class UserHintProfile < ApplicationRecord
  include UuidRetryable

  belongs_to :user
  belongs_to :status_tracking_option, foreign_key: :default_panel_tracking
  belongs_to :default_panel_display_state, class_name: "PanelDisplayState", dependent: :destroy
  accepts_nested_attributes_for :default_panel_display_state
  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_one :user_pref, as: :current_hint_profile

  def to_front_end_complete
    return_obj = {
      # TODO: Stop using ID, stop sending ID to front end, then remove ID
      id:,
      uuid:,
      type: self.class.name,
      name:,
      defaultPanelTracking: default_panel_tracking,
      defaultPanelDisplayState: default_panel_display_state.to_front_end,
      panels: hint_panels.map do |panel|
        panel.to_front_end
      end
    }
    return_obj[:panels].sort_by! { |panel| panel[:displayIndex] }
    return_obj
  end

  def to_front_end_basic
    {
      id:,
      uuid:,
      type: self.class.name,
      name:
    }
  end
end
