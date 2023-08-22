class UserPref < ApplicationRecord
  belongs_to :user
  belongs_to :current_hint_profile, polymorphic: true

  def to_front_end
    {
      colorScheme: color_scheme,
      currentHintProfile: {
        type: current_hint_profile_type,
        id: current_hint_profile_id
      },
    }
  end
end
