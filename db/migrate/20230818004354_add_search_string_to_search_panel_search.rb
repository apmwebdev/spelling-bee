# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class AddSearchStringToSearchPanelSearch < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:search_panel_searches, :search_string)
      add_column :search_panel_searches, :search_string, :string, null: false
    end
  end
end
