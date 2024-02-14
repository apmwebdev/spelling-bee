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

require "rails_helper"

# root_path = "../../app"
# require_relative "#{root_path}/services/openai_api_service"
# require_relative "#{root_path}/services/openai_api_service/constants"

describe "OpenaiApiService" do
  describe "#send_request" do
    context "when submitting invalid 'content'" do
      let(:service) { OpenaiApiService.new }

      it "raises a TypeError when 'content' is nil" do
        expect { service.send_request(nil) }.to raise_error(TypeError)
      end

      it "raises a TypeError when 'content' is an array" do
        expect { service.send_request(%w[foo bar]) }.to raise_error(TypeError)
      end

      it "raises a TypeError when content is an empty string" do
        expect { service.send_request("") }.to raise_error(TypeError)
      end

      it "raises a TypeError when content is too long" do
        long_content = Random.hex(OpenaiApiService::Constants::CONTENT_CHAR_LIMIT + 1)
        expect { service.send_request(long_content) }.to raise_error(TypeError)
      end
    end
  end
end
