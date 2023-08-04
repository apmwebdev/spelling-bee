class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable, :rememberable,
    :validatable, :jwt_cookie_authenticatable, :jwt_authenticatable, jwt_revocation_strategy: self

  # Associations
  has_many :user_puzzle_attempts
  has_many :guesses, through: :user_puzzle_attempts
end
