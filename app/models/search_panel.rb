class SearchPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype
  has_many :search_panel_searches

  def to_front_end
    {
      id:,
      location:,
      outputType: output_type,
      lettersOffset: letters_offset,
    }
  end
end
