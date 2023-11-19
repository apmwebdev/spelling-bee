# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class AddRevealedLettersToDefinitionPanels < ActiveRecord::Migration[7.0]
  def change
    unless column_exists? :definition_panels, :revealed_letters
      add_column :definition_panels, :revealed_letters, :integer, null: false,
        default: 1
      add_check_constraint :definition_panels,
        "revealed_letters > 0",
        name: "positive_revealed_letters"
    end
    remove_column(:definition_panels, :reveal_first_letter, :boolean,
      default: true, null: false, if_exists: true,
    )
  end
end
