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

module SeedStatusTrackingOptions
  def self.seed
    StatusTrackingOption.create!(key: "found_of_total", title: "Found of Total")
    StatusTrackingOption.create!(key: "remaining_of_total", title: "Remaining of Total")
    StatusTrackingOption.create!(key: "found", title: "Found")
    StatusTrackingOption.create!(key: "remaining", title: "Remaining")
    StatusTrackingOption.create!(key: "total", title: "Total")
  end

  def self.unseed
    StatusTrackingOption.destroy_all
  end
end
