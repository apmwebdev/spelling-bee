# frozen_string_literal: true

# Parent class for controllers with all/most actions requiring authentication first
class AuthRequiredController < ApplicationController
  before_action :authenticate_user!
end
