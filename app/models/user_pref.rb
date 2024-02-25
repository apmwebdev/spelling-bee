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
class UserPref < ApplicationRecord
  belongs_to :user
  belongs_to :current_hint_profile, polymorphic: true, primary_key: :uuid,
    foreign_key: :current_hint_profile_uuid

  def to_front_end
    {
      colorScheme: color_scheme,
      currentHintProfile: {
        type: current_hint_profile_type,
        uuid: current_hint_profile_uuid,
      }
    }
  end
end

# == Schema Information
#
# Table name: user_prefs
#
#  id                        :bigint           not null, primary key
#  user_id                   :bigint           not null
#  color_scheme              :enum             default("auto"), not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  current_hint_profile_type :string
#  current_hint_profile_id   :bigint
#  current_hint_profile_uuid :uuid
#
# Indexes
#
#  index_user_prefs_on_current_hint_profile  (current_hint_profile_type,current_hint_profile_id)
#  index_user_prefs_on_user_id               (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
