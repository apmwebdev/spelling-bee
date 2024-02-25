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

# A hint panel within a hint profile. This class holds data common to any hint panel.
# It has a panel_subtype association for data specific to a particular panel type.
class HintPanel < ApplicationRecord
  include UuidRetryable

  belongs_to :hint_profile, polymorphic: true
  belongs_to :initial_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :current_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :status_tracking_option, foreign_key: :status_tracking
  belongs_to :panel_subtype, polymorphic: true, dependent: :destroy
  accepts_nested_attributes_for :initial_display_state, :current_display_state,
    :panel_subtype

  def to_front_end
    {
      uuid:,
      hintProfileType: hint_profile_type,
      hintProfileUuid: hint_profile_uuid,
      name:,
      displayIndex: display_index,
      initialDisplayState: initial_display_state.to_front_end,
      currentDisplayState: current_display_state.to_front_end,
      statusTracking: status_tracking,
      typeData: panel_subtype.to_front_end,
    }
  end

  def to_front_end_basic
    { uuid:, name:, display_index: }
  end
end

# == Schema Information
#
# Table name: hint_panels
#
#  id                         :bigint           not null, primary key
#  name                       :string
#  hint_profile_type          :string           not null
#  hint_profile_id            :bigint           not null
#  initial_display_state_id   :bigint           not null
#  current_display_state_id   :bigint           not null
#  status_tracking            :string           not null
#  panel_subtype_type         :string           not null
#  panel_subtype_id           :bigint           not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  display_index              :integer
#  uuid                       :uuid             not null
#  hint_profile_uuid          :uuid
#  initial_display_state_uuid :uuid
#  panel_subtype_uuid         :uuid
#
# Indexes
#
#  index_hint_panels_on_current_display_state_id    (current_display_state_id)
#  index_hint_panels_on_hint_profile                (hint_profile_type,hint_profile_id)
#  index_hint_panels_on_hint_profile_uuid           (hint_profile_uuid)
#  index_hint_panels_on_initial_display_state_id    (initial_display_state_id)
#  index_hint_panels_on_initial_display_state_uuid  (initial_display_state_uuid) UNIQUE
#  index_hint_panels_on_panel_subtype               (panel_subtype_type,panel_subtype_id)
#  index_hint_panels_on_panel_subtype_uuid          (panel_subtype_uuid)
#  index_hint_panels_on_status_tracking             (status_tracking)
#  index_hint_panels_on_uuid                        (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (current_display_state_id => panel_display_states.id)
#  fk_rails_...  (initial_display_state_id => panel_display_states.id)
#  fk_rails_...  (initial_display_state_uuid => panel_display_states.uuid)
#  fk_rails_...  (status_tracking => status_tracking_options.key)
#
