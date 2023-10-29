class ObscurityPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "obscurity",
      hideKnown: hide_known,
      separateKnown: separate_known,
      revealedLetters: revealed_letters,
      revealLength: reveal_length,
      clickToDefine: click_to_define,
      sortOrder: sort_order
    }
  end
end
