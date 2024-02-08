# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

# :nodoc:
class User < ApplicationRecord
  # Class configuration
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable, :rememberable,
    :confirmable, :lockable, :jwt_cookie_authenticatable,
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
  EMAIL_REGEX = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/

  # Associations
  has_one :user_pref, dependent: :destroy
  has_many :user_puzzle_attempts
  has_many :guesses, through: :user_puzzle_attempts
  has_many :user_hint_profiles
  has_many :hint_panels, through: :user_hint_profiles
  has_many :panel_subtypes, through: :hint_panels
  has_many :search_panels, as: :panel_subtype
  has_many :search_panels,
    # -> { where(panel_subtypes: {type: "SearchPanel"}) },
    through: :hint_panels,
    source: :panel_subtype,
    source_type: "SearchPanel"
  has_many :search_panel_searches, through: :user_puzzle_attempts

  # Validations
  validate :password_complexity, :email_format
  validates :email, presence: true, on: :create
  validates :name, presence: true, on: :create
  validates :password, presence: true, on: :create
  validates :email, uniqueness: true
  validates :password, confirmation: true, unless: -> { password.blank? }
  validates :password_confirmation, presence: true, unless: -> { password.blank? }

  # Methods
  def create_prefs
    UserPref.create!(user_id: id, current_hint_profile: DefaultHintProfile.first)
  end

  def to_front_end
    {email:, name:}
  end

  # Override Devise::Models::DatabaseAuthenticatable#update_with_password
  def update_with_password(params)
    current_password = params.delete(:current_password)
    result = if valid_password?(current_password)
      update(params)
    else
      assign_attributes(params)
      valid?
      errors.add(:current_password, current_password.blank? ? :blank : :invalid)
      false
    end

    clean_up_passwords
    result
  end

  # Override Devise::Models::DatabaseAuthenticatable#update_without_password
  def update_without_password(params)
    params.delete(:password)
    params.delete(:password_confirmation)
    params.delete(:current_password)
    params.delete(:email) if params[:email].blank?
    params.delete(:name) if params[:name].blank?

    result = update(params)
    clean_up_passwords
    result
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
    errors.add :email, "is invalid"
  end
end

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  failed_attempts        :integer          default(0), not null
#  jti                    :string           not null
#  locked_at              :datetime
#  name                   :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  sync_api_key           :string
#  unconfirmed_email      :string
#  unlock_token           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_jti                   (jti) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_sync_api_key          (sync_api_key) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
