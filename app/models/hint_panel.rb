class HintPanel < ApplicationRecord
  belongs_to :hint_profile, polymorphic: true
  belongs_to :initial_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :current_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :status_tracking_option, foreign_key: :status_tracking
  belongs_to :panel_subtype, polymorphic: true, dependent: :destroy

  def to_front_end
    {
      id:,
      name:,
      initialDisplayState: initial_display_state.to_front_end,
      currentDisplayState: current_display_state.to_front_end,
      statusTracking: status_tracking,
      panelType: panel_subtype_type,
      panelTypeData: panel_subtype.to_front_end,
    }
  end
end
