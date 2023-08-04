# frozen_string_literal: true

class AuthRequiredController < ApplicationController
  before_action :authenticate_user!
end
