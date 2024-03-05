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
require "json"

RSpec.describe OpenaiApiService::ParsedResponse do
  include_context "openai_extended"
  fixtures :openai_hint_instructions

  describe "#initialize (mostly testing #parse method)" do
    # Shortcut for creating new instances of ParsedResponse, since the method being tested is
    # #initialize and the logger and validator won't change.
    def create_parsed_response(custom_wrapped_response)
      OpenaiApiService::ParsedResponse.new(logger, validator, custom_wrapped_response)
    end

    def create_http_response(status_code = "200")
      code = status_code.to_s
      response = Net::HTTPResponse.send(:response_class, code)
        .new("1.1", code, "OK")
      response.instance_variable_set("@body", "{foo: \"foo\"}")
      response.instance_variable_set("@read", true)
      response
    end

    context "when initialized with a valid wrapped_response" do
      it "sets @raw_response to wrapped_response[:response]" do
        expect(parsed_response.raw_response).to eq(wrapped_response[:response])
      end

      it "sets @http_status to 200" do
        expect(parsed_response.http_status).to eq(200)
      end

      it "sets @response_time_seconds to a float with 3 digits after the decimal",
        :aggregate_failures do
        value = parsed_response.response_time_seconds
        expect(value).to be_a(Float)
        expect(value.round(3)).to eq(value)
      end

      it "has @headers with all keys from RELEVANT_HEADERS" do
        relevant_headers = OpenaiApiService::Constants::RELEVANT_HEADERS
        headers = parsed_response.headers
        headers_valid = relevant_headers.all? { |h| headers.key?(h) }
        expect(headers_valid).to be(true)
      end

      it "has @word_hints with length equal to the length of the word list sent to the API" do
        word_hints_length = parsed_response.word_hints.length
        word_list_length = full_word_list.word_set.length
        expect(word_hints_length).to eq(word_list_length)
      end

      it "sets @body_meta to a hash" do
        expect(parsed_response.body_meta).to be_a(Hash)
      end

      it "sets @error_body to nil" do
        expect(parsed_response.error_body).to be_nil
      end
    end

    # For tests where some pieces of the response are valid, but others aren't
    # Unlike most validation, semi-valid parsed responses don't necessarily halt program
    # execution since most of the data is only for logging/auditing purposes.
    context "when initialized with a semi-valid wrapped_response" do
      let(:response) { create_http_response }

      it "sets @raw_response to response as long as it's a Net::HTTPResponse" do
        wrapped_response[:response] = response
        parsed_response = create_parsed_response(wrapped_response)
        expect(parsed_response.raw_response).to eq(response)
      end

      it "has @headers with any valid headers included in the response", :aggregate_failures do
        response.add_field("openai-version", "bar")
        wrapped_response[:response] = response
        parsed_response = create_parsed_response(wrapped_response)
        expect(parsed_response.headers.entries.length).to eq(1)
        expect(parsed_response.headers.keys.first).to eq("openai-version")
      end

      it "sets @http_status to response code as an integer", :aggregate_failures do
        status201 = 201
        created_response = create_http_response(status201)
        wrapped_response[:response] = created_response
        parsed_response1 = create_parsed_response(wrapped_response)
        expect(parsed_response1.http_status).to eq(status201)

        status202 = 202
        accepted_response = create_http_response(status202)
        wrapped_response[:response] = accepted_response
        parsed_response2 = create_parsed_response(wrapped_response)
        expect(parsed_response2.http_status).to eq(status202)
      end

      context "when response.body is invalid" do
        def parse_with_body(res_body)
          wrapped_response[:response].body = res_body
          create_parsed_response(wrapped_response)
        end

        it "sets @error_body to response.body and @word_hints to nil if response.body is invalid JSON",
          :aggregate_failures do
          string_body = "foo"
          parsed_response = parse_with_body(string_body)
          expect(parsed_response.error_body).to eq(string_body)
          expect(parsed_response.word_hints).to be_nil
        end

        it "sets @error_body to response.body as JSON and @word_hints to nil if response.body is a JSON string missing required properties",
          :aggregate_failures do
          body = "{\"foo\": \"foo\"}"
          body_as_json = JSON.parse(body, symbolize_names: true)
          parsed_response = parse_with_body(body)
          expect(parsed_response.error_body).to eq(body_as_json)
          expect(parsed_response.word_hints).to be_nil

          body = { foo: "foo" }
          body_as_string = JSON.generate(body)
          parsed_response = parse_with_body(body_as_string)
          expect(parsed_response.error_body).to eq(body)
          expect(parsed_response.word_hints).to be_nil

          body = "{ \"choices\": \"foo\" }"
          body_as_json = JSON.parse(body, symbolize_names: true)
          parsed_response = parse_with_body(body)
          expect(parsed_response.error_body).to eq(body_as_json)
          expect(parsed_response.word_hints).to be_nil

          body = "{ \"choices\": [{ \"message\": \"foo\" }] }"
          body_as_json = JSON.parse(body, symbolize_names: true)
          parsed_response = parse_with_body(body)
          expect(parsed_response.error_body).to eq(body_as_json)
          expect(parsed_response.word_hints).to be_nil
        end
      end
    end

    context "when initialized with an invalid wrapped_response" do
      it "raises a TypeError if wrapped_response is invalid", :aggregate_failures do
        wrapped_response = nil
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response = {}
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response = []
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
      end

      it "raises a TypeError if response_time is invalid", :aggregate_failures do
        wrapped_response[:response_time] = 0
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response[:response_time] = nil
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response[:response_time] = "0"
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response[:response_time] = {}
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response[:response_time] = []
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response.delete(:response_time)
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
      end

      it "raises a TypeError if response is invalid", :aggregate_failures do
        wrapped_response[:response] = nil
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response[:response] = {}
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
        wrapped_response.delete(:response)
        expect { create_parsed_response(wrapped_response) }.to raise_error(TypeError)
      end
    end
  end
end
