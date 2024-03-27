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
    before do
      allow(DatamuseApiService).to receive(:get_word_data).with(any_args)
        .and_return({ frequency: 1, definitions: ["blah"] })
    end

    it "creates number of puzzles equal to page_size * page_limit" do
      expect { service.sync_puzzles(1, page_size:, page_limit:) }
        .to change(Puzzle, :count).by(page_size * page_limit)
    end

    it "creates answers for all puzzles" do
      answers_fixture_path = Rails.root.join("spec/fixtures/answers.yml")
      expected_count = YAML.load_file(answers_fixture_path).length
      expect { service.sync_puzzles(1, page_size:, page_limit:) }
        .to change(Answer, :count).by(expected_count)
    end

    it "creates words for any words that don't exist" do
      words_fixture_path = Rails.root.join("spec/fixtures/words.yml")
      expected_count = YAML.load_file(words_fixture_path).length
      expect { service.sync_puzzles(1, page_size:, page_limit:) }
        .to change(Word, :count).by(expected_count)
    end

    it "properly saves word hints" do
      words_fixture_path = Rails.root.join("spec/fixtures/words.yml")
      expected_count = YAML.load_file(words_fixture_path).length
      expect { service.sync_puzzles(1, page_size:, page_limit:) }
        .to change(Word.where.not(hint: nil), :count).by(expected_count)
    end

    context "when all words already exist in the database" do
      fixtures :words

      it "doesn't change the number of words in the database" do
        expect { service.sync_puzzles(1, page_size:, page_limit:) }
          .not_to change(Word, :count)
      end

      it "properly saves word hints" do
        words_fixture_path = Rails.root.join("spec/fixtures/words.yml")
        expected_count = YAML.load_file(words_fixture_path).length
        expect { service.sync_puzzles(1, page_size:, page_limit:) }
          .to change(Word.where.not(hint: nil), :count).by(expected_count)
      end
    end
  end
end
