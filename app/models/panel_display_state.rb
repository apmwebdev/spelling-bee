class PanelDisplayState < ApplicationRecord
  has_one :hint_panel, foreign_key: :initial_display_state_id, optional: true
  has_one :hint_panel, foreign_key: :current_display_state_id, optional: true
  has_one :user_hint_profile, foreign_key: :default_panel_display_state_id, optional: true
end
