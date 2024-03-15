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

RSpec.describe NytScraperService,
  vcr: { cassette_name: "nyt_scraper_fetch_puzzle_json" } do
  before(:all) do
    # DatabaseCleaner.truncate_tables
    @logger = ContextualLogger.new(is_dummy: true)
    @validator = NytScraperValidator.new(@logger)
    @service = NytScraperService.new(logger: @logger)
    VCR.use_cassette("nyt_scraper_fetch_puzzle_json") do
      @puzzle_json = @service.fetch_puzzle_json
    end
    @today_json = @puzzle_json[:today]
  end

  describe "#fetch_puzzle_json",
    vcr: { cassette_name: "nyt_scraper_fetch_puzzle_json" } do
    it "parses the puzzle JSON and returns a hash" do
      expect(@service.fetch_puzzle_json).to be_a(Hash)
    end

    it "returns a hash in the expected format" do
      expect(@validator.valid?(@service.fetch_puzzle_json)).to be(true)
    end
  end

  describe "#create_puzzle_from_json",
    vcr: { cassette_name: "nyt_scraper_create_puzzle_from_json" } do
    fixtures :openai_hint_instructions

    before(:all) do
      @answer_count = @today_json[:answers].length
    end

    it "returns early if a puzzle with the same date already exists", :aggregate_failures do
      allow(Puzzle).to receive(:exists?).with(any_args).and_return(true)
      expect { @service.create_puzzle_from_json(@today_json) }.not_to change(NytPuzzle, :count)
      expect { @service.create_puzzle_from_json(@today_json) }.not_to change(Puzzle, :count)
      expect { @service.create_puzzle_from_json(@today_json) }.not_to change(Answer, :count)
      allow(@logger).to receive(:info)
      expect(@logger).to receive(:info).with("Puzzle exists. Exiting")
      @service.create_puzzle_from_json(@today_json)
    end

    it "creates a NytPuzzle" do
      expect { @service.create_puzzle_from_json(@today_json) }.to change(NytPuzzle, :count).by(1)
    end

    it "formats the NytPuzzle properly" do
      @service.create_puzzle_from_json(@today_json)
      nyt_puzzle = NytPuzzle.first
      expect(nyt_puzzle.nyt_id).to eq(@today_json[:id])
      expect(nyt_puzzle.json_data.deep_symbolize_keys).to eq(@today_json)
    end

    it "creates creates all words if none are in the database" do
      expect { @service.create_puzzle_from_json(@today_json) }
        .to change(Word, :count).by(@answer_count)
    end

    it "creates no words if all already exist in the database" do
      @today_json[:answers].each { |text| Word.create!(text:) }
      expect { @service.create_puzzle_from_json(@today_json) }
        .not_to change(Word, :count)
    end

    it "creates all answers" do
      expect { @service.create_puzzle_from_json(@today_json) }
        .to change(Answer, :count).by(@answer_count)
    end

    it "fetches Datamuse data for every word if none already have Datamuse data" do
      allow(DatamuseApiService).to receive(:get_word_data).with(any_args).and_call_original
      expect(DatamuseApiService).to receive(:get_word_data).with(any_args)
        .exactly(@answer_count).times
      @service.create_puzzle_from_json(@today_json)
    end

    it "doesn't fetch Datamuse data for any words if they all already have Datamuse data" do
      @today_json[:answers].each { |text| Word.create!(text:, frequency: 1) }
      allow(DatamuseApiService).to receive(:get_word_data).with(any_args).and_call_original
      expect(DatamuseApiService).not_to receive(:get_word_data).with(any_args)
      @service.create_puzzle_from_json(@today_json)
    end

    it "persists all fetched Datamuse data", :aggregate_failures do
      allow(DatamuseApiService).to receive(:get_word_data).with(any_args).and_call_original
      expect(DatamuseApiService).to receive(:get_word_data).with(any_args)
        .exactly(@answer_count).times
      @service.create_puzzle_from_json(@today_json)
      words_with_data_count = Word.where.not(frequency: nil).where.not(definitions: nil).count
      expect(words_with_data_count).to eq(@answer_count)
    end

    it "fetches hints for all words if no words have hints" do
      @service.create_puzzle_from_json(@today_json)
      words_with_hints_count = Word.where.not(hint: nil).count
      expect(words_with_hints_count).to eq(@answer_count)
    end
  end

  describe "#import_all_puzzles" do
    let(:openai_dbl) { instance_double(OpenaiApiService).as_null_object }
    before do
      allow(@service).to receive(:fetch_puzzle_json).and_return(@puzzle_json)
      allow(DatamuseApiService).to receive(:get_word_data)
        .and_return({ frequency: 1, definitions: "blah" })
      allow(OpenaiApiService).to receive(:new).and_return(openai_dbl)
    end

    it "creates all puzzles" do
      DatabaseCleaner.truncate_only(["puzzles"])
      @service.import_all_puzzles
      past_puzzles = @puzzle_json[:pastPuzzles]
      expected_result = past_puzzles[:lastWeek].length + past_puzzles[:thisWeek].length
      expect(Puzzle.count).to eq(expected_result)
    end
  end
end
