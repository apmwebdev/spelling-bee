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

# Controls account unlocks
class Api::V1::Users::UnlocksController < Devise::UnlocksController
  # GET /resource/unlock?unlock_token=abcdef
  def show
    self.resource = resource_class.unlock_access_by_token(params[:unlock_token])
    if resource.errors.empty?
      redirect_to ENV["AFTER_UNLOCK_URL"]
      return
    end
    redirect_to ENV["AFTER_UNSUCCESSFUL_UNLOCK_URL"]
  end
end
