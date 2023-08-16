class SearchPanelSearch < ApplicationRecord
  belongs_to :search_panel
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      attemptId: user_puzzle_attempt_id,
      location:,
      lettersOffset: letters_offset,
      outputType: output_type,
    }
  end
end
