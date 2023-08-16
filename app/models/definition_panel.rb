class DefinitionPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      showKnown: show_known,
      revealLength: reveal_length,
      showObscurity: show_obscurity,
      sortOrder: sort_order,
    }
  end
end
