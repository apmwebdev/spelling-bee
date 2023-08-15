class UserHintProfile < ApplicationRecord
  belongs_to :user
  belongs_to :status_tracking_option, foreign_key: :default_panel_tracking
  belongs_to :default_panel_display_state, class_name: "PanelDisplayState"
  has_many :hint_panels, as: :hint_profile
end
