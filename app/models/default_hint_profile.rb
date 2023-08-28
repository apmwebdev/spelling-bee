class DefaultHintProfile < ApplicationRecord
  has_many :hint_panels, as: :hint_profile, dependent: :destroy
  has_many :user_prefs, as: :current_hint_profile

  def to_front_end_complete
    return_obj = {
      id:,
      type: self.class.name,
      name:,
      panels: hint_panels.map do |panel|
        panel.to_front_end
      end
    }
    return_obj[:panels].sort! { |a, b| a[:displayIndex] <=> b[:displayIndex] }
    return_obj
  end

  def to_front_end_basic
    {
      id:,
      type: self.class.name,
      name:,
    }
  end
end
