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

# Mixin for responding to ApiErrors. Necessary because custom Devise controllers
# don't inherit from ApplicationController.
module ApiErrorRescuable
  extend ActiveSupport::Concern

  included do
    rescue_from ApiError do |e|
      render json: e.to_front_end, status: e.status
    end
  end
end
