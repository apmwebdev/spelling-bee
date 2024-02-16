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

describe "OpenaiApiService" do
  describe "#send_request" do
    let(:logger) { ContextualLogger.new(IO::NULL, puts_only_g: true) }
    let(:validator) { OpenaiApiService::Validator.new(logger) }
    let(:service) { OpenaiApiService.new(logger:, validator:) }

    context "when submitting invalid 'content'" do
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

    context "when submitting valid 'content'", vcr: { cassette_name: "basic_chat" } do
      let(:valid_content) { "What is OpenAI?" }
      let(:wrapped_response) { service.send_request(valid_content, format_as_json: false) }
      let(:response) { wrapped_response[:response] }

      it "returns a successful response" do
        expect(response.code).to eq("200")
      end

      it "returns a response body in the expected format" do
        expect(validator.valid_response_body?(response.body)).to be(true)
      end

      it "returns the expected headers" do
        expect(validator.expected_response_headers?(response)).to be(true)
      end
    end
  end
end
