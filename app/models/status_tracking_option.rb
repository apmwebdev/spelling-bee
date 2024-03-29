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
class StatusTrackingOption < ActiveRecord::Base
  self.primary_key = :key
  has_many :user_hint_profiles, primary_key: :key, foreign_key: :default_panel_tracking
  has_many :hint_panels, primary_key: :key, foreign_key: :status_tracking
end

# == Schema Information
#
# Table name: status_tracking_options
#
#  key        :string           not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_status_tracking_options_on_key  (key) UNIQUE
#
