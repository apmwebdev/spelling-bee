class DefaultHintProfile < ApplicationRecord
  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_many :user_prefs, as: :current_hint_profile

  def to_front_end_complete
    {
      id:,
      name:,
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
