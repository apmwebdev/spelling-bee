class DefinitionPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "definition",
      hideKnown: hide_known,
      revealedLetters: revealed_letters,
      revealLength: reveal_length,
      showObscurity: show_obscurity,
      sortOrder: sort_order,
    }
  end
end
