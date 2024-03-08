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

RSpec.describe "SyncApi::V1::WordHints", type: :request do
  describe "GET /sync_api/v1/word_hints" do
    fixtures :puzzles, :words, :answers
    let(:logger) { ContextualLogger.new(IO::NULL, global_puts_and: false) }
    let(:validator) { SyncApiService::Validator.new(logger) }

    before do
      allow_any_instance_of(SyncApi::V1::SyncApiController).to receive(:authenticate_sync_api_user!)
        .and_return(true)
    end

    it "returns data when page is 0", :aggregate_failures do
      Word.update_all("hint = 'not nil'")
      get "/sync_api/v1/word_hints/0"

      json = JSON.parse(response.body, symbolize_names: true)
      expect(response).to have_http_status(200)
      expect(validator.valid_hint_response!(json)).to be(true)
      expect(json[:data].length).to eq(Word.count)
    end
  end
end
