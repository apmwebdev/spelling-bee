class SearchPanelSearch < ApplicationRecord
  belongs_to :search_panel
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      id:,
      attemptId: user_puzzle_attempt_id,
      searchPanelId: search_panel_id,
      searchString: search_string,
      location:,
      lettersOffset: letters_offset,
      outputType: output_type,
      createdAt: created_at,
    }
  end
end
