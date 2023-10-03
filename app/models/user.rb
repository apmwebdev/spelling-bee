class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable, :rememberable,
    :confirmable, :validatable, :jwt_cookie_authenticatable,
    :jwt_authenticatable, jwt_revocation_strategy: self

  # Associations
  has_one :user_pref, dependent: :destroy
  # has_one :current_hint_profile, through: :user_pref
  has_many :user_puzzle_attempts
  has_many :guesses, through: :user_puzzle_attempts
  has_many :user_hint_profiles
  has_many :hint_panels, through: :user_hint_profiles

  def create_prefs
    UserPref.create!(user_id: id, current_hint_profile: DefaultHintProfile.first)
  end

  def to_front_end
    { email:, name: }
  end

  private

  # Override Devise::Confirmable#after_confirmation
  def after_confirmation
    super
    create_prefs
  end

end
