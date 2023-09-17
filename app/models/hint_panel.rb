class HintPanel < ApplicationRecord
  belongs_to :hint_profile, polymorphic: true
  belongs_to :initial_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :current_display_state, class_name: "PanelDisplayState", dependent: :destroy
  belongs_to :status_tracking_option, foreign_key: :status_tracking
  belongs_to :panel_subtype, polymorphic: true, dependent: :destroy
  accepts_nested_attributes_for :initial_display_state, :current_display_state,
    :panel_subtype

  def to_front_end
    {
      id:,
      name:,
      displayIndex: display_index,
      initialDisplayState: initial_display_state.to_front_end,
      currentDisplayState: current_display_state.to_front_end,
      statusTracking: status_tracking,
      typeData: panel_subtype.to_front_end,
    }
  end

  def to_front_end_basic
    { id:, name:, display_index: }
  end
end
