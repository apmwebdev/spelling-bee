class SearchPanelSearch < ApplicationRecord
  belongs_to :search_panel
  belongs_to :user_puzzle_attempt
end
