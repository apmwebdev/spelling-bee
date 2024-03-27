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

RSpec.describe SyncApiService do
  before(:all) do
    @logger = ContextualLogger.new(IO::NULL, global_puts_and: false)
  end
  before do
    @logger.global_puts_and = false
  end

  let(:validator) { SyncApiService::Validator.new(@logger) }
  let(:service) { SyncApiService.new(logger: @logger, validator:) }

  describe "#sync_puzzles", vcr: { cassette_name: "sync_api_sync_puzzles" } do
    let(:page_size) { 3 }
    let(:page_limit) { 1 }

    it "creates number of puzzles equal to page_size * page_limit" do
      @logger.global_puts_and = true
      expect { service.sync_puzzles(1, page_size:, page_limit:) }
        .to change(Puzzle, :count).by(page_size * page_limit)
    end
  end
end
