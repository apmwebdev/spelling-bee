# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class StatusTrackingOption < ActiveRecord::Base
  self.primary_key = :key
  has_many :user_hint_profiles, primary_key: :key, foreign_key: :default_panel_tracking
  has_many :hint_panels, primary_key: :key, foreign_key: :status_tracking
end
