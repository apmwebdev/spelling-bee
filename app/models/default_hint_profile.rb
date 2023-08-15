class DefaultHintProfile < ApplicationRecord
  has_many :hint_panels, as: :hint_profile
end
