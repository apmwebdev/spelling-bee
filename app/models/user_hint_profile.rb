class UserHintProfile < ApplicationRecord
  belongs_to :user
  belongs_to :status_tracking_option, foreign_key: :default_panel_tracking
  belongs_to :default_panel_display_state, class_name: "PanelDisplayState", dependent: :destroy
  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_one :user_pref, as: :current_hint_profile

  def to_front_end_complete
    {
      id:,
      name:,
      defaultPanelTracking: default_panel_tracking,
      defaultPanelDisplayState: default_panel_display_state.to_front_end,
      panels: hint_panels.map do |panel|
        panel.to_front_end
      end
    }
  end

  def to_front_end_basic
    {
      id:,
      name:,
    }
  end
end
