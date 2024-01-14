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

# Converts a Date.now() Unix timestamp (i.e., a millisecond timestamp created in JS)
# to a Ruby Time object
module TimestampConverter
  extend ActiveSupport::Concern

  private

  def railsify_timestamp(timestamp)
    precise_timestamp = BigDecimal(timestamp.to_s)
    timestamp_in_seconds = precise_timestamp / 1000
    Time.at(timestamp_in_seconds)
  end
end
