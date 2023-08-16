class ObscurityPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      showKnown: show_known,
      separateKnown: separate_known,
      revealFirstLetter: reveal_first_letter,
      revealLength: reveal_length,
      clickToDefine: click_to_define,
      sortOrder: sort_order,
    }
  end
end
