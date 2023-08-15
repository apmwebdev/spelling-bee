class SearchPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype
  has_many :search_panel_searches
end
