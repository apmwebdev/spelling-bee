# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class RemoveUsernameFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column(:users, :username, if_exists: true)
    remove_column(:users, :uid, if_exists: true)
    remove_column(:users, :provider, if_exists: true)
    remove_column(:users, :allow_password_change, if_exists: true)
    remove_column(:users, :tokens, if_exists: true)
  end
end
