class UserPref < ApplicationRecord
  belongs_to :user

  def to_front_end
    {
      colorScheme: self.color_scheme
    }
  end
end
