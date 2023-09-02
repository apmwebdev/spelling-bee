class SearchPanelSearch < ApplicationRecord
  belongs_to :search_panel
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      id:,
      searchPanelId: search_panel_id,
      attemptId: user_puzzle_attempt_id,
      searchString: search_string,
      location:,
      lettersOffset: letters_offset,
      outputType: output_type,
      createdAt: created_at.to_i,
    }
  end
end
