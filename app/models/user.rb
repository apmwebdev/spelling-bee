class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable, :rememberable,
    :validatable, :jwt_cookie_authenticatable, :jwt_authenticatable, jwt_revocation_strategy: self

  # Associations
  has_one :user_pref
  has_many :user_puzzle_attempts
  has_many :guesses, through: :user_puzzle_attempts
  has_many :user_hint_profiles
  has_many :hint_panels, through: :user_hint_profiles

  after_create_commit :create_prefs

  def create_prefs
    UserPref.create(user_id: self.id)
  end
end
