class HintPanel < ApplicationRecord
  belongs_to :hint_profile, polymorphic: true
  belongs_to :initial_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :current_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :status_tracking_option, foreign_key: :status_tracking
  belongs_to :panel_subtype, polymorphic: true, dependent: :destroy
end
