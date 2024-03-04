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

RSpec.describe OpenaiApiService::BatchState do
  include_context "openai_base"

  let(:batch_state) { OpenaiApiService::BatchState.new(logger) }

  describe "#update_from_response" do
    include_context "openai_extended"

    it "raises a TypeError if passed a non-ParsedResponse value", :aggregate_failures do
      expect { batch_state.update_from_response(nil) }.to raise_error(TypeError)
      expect { batch_state.update_from_response("foo") }.to raise_error(TypeError)
      expect { batch_state.update_from_response(123) }.to raise_error(TypeError)
      expect { batch_state.update_from_response({}) }.to raise_error(TypeError)
      expect { batch_state.update_from_response([]) }.to raise_error(TypeError)
    end

    context "when passed a valid ParsedResponse" do
      it "increases @request_count by 1" do
        expect { batch_state.update_from_response(parsed_response) }
          .to change(batch_state, :request_count).by(1)
      end

      it "correctly sets @remaining_requests based on the x-ratelimit-remaining-requests header" do
        expected_result = 9999
        expect { batch_state.update_from_response(parsed_response) }
          .to change(batch_state, :remaining_requests).to(expected_result)
      end

      it "correctly sets @remaining_tokens based on the x-ratelimit-remaining-tokens header" do
        expected_result = 59_682
        expect { batch_state.update_from_response(parsed_response) }
          .to change(batch_state, :remaining_tokens).to(expected_result)
      end

      it "correctly sets @reset_requests_s based on the x-ratelimit-reset-requests header" do
        expected_result = 8.64
        expect { batch_state.update_from_response(parsed_response) }
          .to change(batch_state, :reset_requests_s).to(expected_result)
      end

      it "correctly sets @reset_tokens_s based on the x-ratelimit-reset-tokens header" do
        expected_result = 0.318
        expect { batch_state.update_from_response(parsed_response) }
          .to change(batch_state, :reset_tokens_s).to(expected_result)
      end
    end
  end

  describe "#calculate_seconds" do
    def run_calc(input)
      batch_state.calculate_seconds(input)
    end
    it "returns nil when passed nil" do
      expect(run_calc(nil)).to be_nil
    end

    it "returns a float when passed a float", :aggregate_failures do
      expect(run_calc(1.2)).to be(1.2)
      expect(run_calc(3.845)).to be(3.845)
      expect(run_calc(345_678.845)).to be(345_678.845)
    end

    it "raises a TypeError if passed a non-nil, non-float, non-string value",
      :aggregate_failures do
      expect { run_calc(123) }.to raise_error(TypeError)
      expect { run_calc(123) }.to raise_error(TypeError)
      expect { run_calc([]) }.to raise_error(TypeError)
      expect { run_calc({}) }.to raise_error(TypeError)
    end

    it "returns nil if passed an invalid string" do
      expect(run_calc("foo")).to be_nil
      expect(run_calc("bar")).to be_nil
      expect(run_calc("foobar")).to be_nil
    end

    it "always returns a float, even when an integer would be equivalent" do
      duration_string = "90m"
      expected_result = 5400.0
      expect(run_calc(duration_string)).to eq(expected_result)
        .and(be_a(Float))
    end

    it "parses a string of milliseconds" do
      duration_string = "90ms"
      expected_result = 0.090
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of seconds" do
      duration_string = "90s"
      expected_result = 90.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of minutes" do
      duration_string = "90m"
      expected_result = 5400.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours" do
      duration_string = "9h"
      expected_result = 32_400.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of seconds and milliseconds" do
      duration_string = "90s900ms"
      expected_result = 90.900
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of minutes and milliseconds" do
      duration_string = "90m900ms"
      expected_result = 5400.900
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours and milliseconds" do
      duration_string = "9h900ms"
      expected_result = 32_400.900
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of minutes and seconds" do
      duration_string = "90m90s"
      expected_result = 5490.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours and seconds" do
      duration_string = "9h90s"
      expected_result = 32_490.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours and minutes" do
      duration_string = "9h90m"
      expected_result = 37_800.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of minutes, seconds, and milliseconds" do
      duration_string = "90m90s90ms"
      expected_result = 5490.09
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours, seconds, and milliseconds" do
      duration_string = "9h90s90ms"
      expected_result = 32_490.09
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours, minutes, and milliseconds" do
      duration_string = "9h90m90ms"
      expected_result = 37_800.09
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours, minutes, and seconds" do
      duration_string = "9h90m90s"
      expected_result = 37_890.0
      expect(run_calc(duration_string)).to be(expected_result)
    end

    it "parses a string of hours, minutes, seconds, and milliseconds" do
      duration_string = "9h90m90s90ms"
      expected_result = 37_890.09
      expect(run_calc(duration_string)).to be(expected_result)
    end
  end

  describe "#sleep_time_from_retry_count" do
    it "returns 0 if @retry_count is nil" do
      batch_state.instance_variable_set(:@retry_count, nil)
      expect(batch_state.sleep_time_from_retry_count).to eq(0)
    end

    (0...OpenaiApiService::Constants::RETRY_COUNT_SLEEP_TIMES.length).each do |retry_count|
      it "returns the corresponding sleep time when @retry_count is #{retry_count}",
        :aggregate_failures do
        batch_state.retry_count = retry_count
        expected_result = OpenaiApiService::Constants::RETRY_COUNT_SLEEP_TIMES[retry_count]
        expect(batch_state.sleep_time_from_retry_count).to eq(expected_result)
      end
    end

    it "raises an error when @retry_count is greater than the number of allowed retries" do
      batch_state.retry_count = OpenaiApiService::Constants::RETRY_COUNT_SLEEP_TIMES.length
      expect { batch_state.sleep_time_from_retry_count }.to raise_error(StandardError)
    end
  end
end
