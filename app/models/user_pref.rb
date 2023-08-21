class UserPref < ApplicationRecord
  belongs_to :user
  belongs_to :current_hint_profile, polymorphic: true

  def to_front_end
    {
      colorScheme: color_scheme,
      currentHintProfileType: current_hint_profile_type,
      currentHintProfileId: current_hint_profile_id
    }
  end
end
