class User < ApplicationRecord
  # Class configuration
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable, :rememberable,
    :confirmable, :jwt_cookie_authenticatable,
    :jwt_authenticatable, jwt_revocation_strategy: self

  # Constants

  # Regex used to validate submitted passwords
  # Requires:
  # - Length of 10 to 128 characters
  # - One uppercase letter, lowercase letter, and number
  # - One symbol, specifically a non-letter, non-digit, non-whitespace character
  # *Can* include any other characters as well (e.g., spaces)
  PASSWORD_REGEX = /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\sa-zA-Z]).{10,128}\z/

  # Used to validate submitted email addresses. Ported from
  # https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
  # This mirrors the validation that browsers do on email input fields.
  # Requires:
  # - A username: One or more characters that are letters, digits, or
  #   various symbols that come before the @ symbol
  # - An @ symbol
  # - The domain name: One or more sequences ("subdomains") of 1-63 letters,
  #   numbers, and/or dashes, separated by periods. Subdomains can't begin or
  #   or end with a dash.
  EMAIL_REGEX =  /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/

  # Associations
  has_one :user_pref, dependent: :destroy
  has_many :user_puzzle_attempts
  has_many :guesses, through: :user_puzzle_attempts
  has_many :user_hint_profiles
  has_many :hint_panels, through: :user_hint_profiles

  # Validations
  validate :password_complexity, :email_format
  validates :name, presence: true, on: :create

  # Methods
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

  def password_complexity
    # password.blank? is allowed because Passwords are still required when
    # creating an account, but that is checked by Devise automatically. This
    # allows account updates without including the password each time.
    return if password.blank? || password =~ PASSWORD_REGEX
    errors.add :password, "must be 10-128 characters and include at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol"
  end

  def email_format
    # See explanation above for why a blank email should bypass validation
    return if email.blank? || email =~ EMAIL_REGEX
    errors.add :email, "invalid"
  end

end
