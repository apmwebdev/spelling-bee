class DefinitionPanel < ApplicationRecord
  has_one :hint_panel, as: :panel_subtype
end
