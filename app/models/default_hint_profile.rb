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

# A built-in hint profile available to all users
class DefaultHintProfile < ApplicationRecord
  include UuidRetryable

  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_many :user_prefs, as: :current_hint_profile

  def to_front_end_complete
    return_obj = {
      uuid:,
      type: self.class.name,
      name:,
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
