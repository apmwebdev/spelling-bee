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

# A user-created hint profile, as opposed to a DefaultHintProfile
class UserHintProfile < ApplicationRecord
  include UuidRetryable

  belongs_to :user
  belongs_to :status_tracking_option, foreign_key: :default_panel_tracking
  belongs_to :default_panel_display_state, class_name: "PanelDisplayState",
    dependent: :destroy
  accepts_nested_attributes_for :default_panel_display_state
  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_one :user_pref, as: :current_hint_profile

  def to_front_end_complete
    return_obj = {
      uuid:,
      type: self.class.name,
      name:,
      defaultPanelTracking: default_panel_tracking,
      defaultPanelDisplayState: default_panel_display_state.to_front_end,
      panels: hint_panels.map(&:to_front_end),
    }
    return_obj[:panels].sort_by! { |panel| panel[:displayIndex] }
    return_obj
  end

  def to_front_end_basic
    {
      uuid:,
      type: self.class.name,
      name:,
    }
  end
end

# == Schema Information
#
# Table name: user_hint_profiles
#
#  id                               :bigint           not null, primary key
#  name                             :string
#  user_id                          :bigint           not null
#  default_panel_tracking           :string           not null
#  default_panel_display_state_id   :bigint           not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#  uuid                             :uuid             not null
#  default_panel_display_state_uuid :uuid
#
# Indexes
#
#  index_user_hint_profiles_on_default_panel_display_state_id    (default_panel_display_state_id)
#  index_user_hint_profiles_on_default_panel_display_state_uuid  (default_panel_display_state_uuid) UNIQUE
#  index_user_hint_profiles_on_default_panel_tracking            (default_panel_tracking)
#  index_user_hint_profiles_on_user_id                           (user_id)
#  index_user_hint_profiles_on_uuid                              (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (default_panel_display_state_id => panel_display_states.id)
#  fk_rails_...  (default_panel_display_state_uuid => panel_display_states.uuid)
#  fk_rails_...  (default_panel_tracking => status_tracking_options.key)
#  fk_rails_...  (user_id => users.id)
#
