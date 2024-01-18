# frozen_string_literal: true

# Parent class for controllers with all/most actions requiring authentication first
class FrontEndApi::AuthRequiredController < FrontEndApi::FrontEndApiController
  before_action :authenticate_user!
end
