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

# Converts a Rails created_at or updated_at Time object to a millisecond Unix
# timestamp for compatibility with the Date.now() method in JavaScript.
module TimeConverter
  extend ActiveSupport::Concern

  private

  def jsify_timestamp(timestamp)
    (BigDecimal(timestamp.to_f.to_s) * 1000).to_i
  end
end
