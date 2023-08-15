class PanelDisplayState < ApplicationRecord
  has_one :hint_panel, required: false, foreign_key: :initial_display_state_id
  has_one :hint_panel, required: false, foreign_key: :current_display_state_id
  has_one :user_hint_profile, required: false, foreign_key: :default_panel_display_state_id
end
