# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

class DefinitionPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "definition",
      hideKnown: hide_known,
      revealedLetters: revealed_letters,
      separateKnown: separate_known,
      revealLength: reveal_length,
      showObscurity: show_obscurity,
      sortOrder: sort_order
    }
  end
end
