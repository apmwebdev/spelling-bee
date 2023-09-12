class LetterPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "letter",
      location:,
      outputType: output_type,
      numberOfLetters: number_of_letters,
      lettersOffset: letters_offset,
      hideKnown: hide_known,
    }
  end
end
