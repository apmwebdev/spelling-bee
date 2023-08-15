class StatusTrackingOption < ActiveRecord::Base
  self.primary_key = :key
  has_many :user_hint_profiles, primary_key: :key, foreign_key: :default_panel_tracking
  has_many :hint_panels, primary_key: :key, foreign_key: :status_tracking
end
