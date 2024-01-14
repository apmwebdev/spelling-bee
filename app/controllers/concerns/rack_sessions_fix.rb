# frozen_string_literal: true

# Allows authentication to work without sessions. Necessary with JWTs
module RackSessionsFix
  extend ActiveSupport::Concern

  # :nodoc:
  class FakeRackSession < Hash
    def enabled?
      false
    end

    def destroy; end
  end

  included do
    before_action :set_fake_session

    private

    def set_fake_session
      request.env["rack.session"] ||= FakeRackSession.new
    end
  end
end
