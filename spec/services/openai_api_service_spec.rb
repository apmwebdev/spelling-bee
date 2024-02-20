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
  include_context "word lists"

  let(:logger) { ContextualLogger.new(IO::NULL, puts_only_g: true, log_level: Logger::INFO) }
  # logger.level = Logger::INFO
  let(:validator) { OpenaiApiService::Validator.new(logger) }

  describe "#send_request" do
    let(:service) { OpenaiApiService.new(logger:, validator:) }

    context "when submitting invalid `content`" do
      it "raises a TypeError when `content` is nil" do
        expect { service.send_request(nil) }.to raise_error(TypeError)
      end

      it "raises a TypeError when `content` is an array" do
        expect { service.send_request(%w[foo bar]) }.to raise_error(TypeError)
      end

      it "raises a TypeError when `content` is an empty string" do
        expect { service.send_request("") }.to raise_error(TypeError)
      end

      it "raises a TypeError when `content` is too long" do
        long_content = Random.hex(OpenaiApiService::Constants::CONTENT_CHAR_LIMIT + 1)
        expect { service.send_request(long_content) }.to raise_error(TypeError)
      end
    end

    context "when submitting valid `content`", vcr: { cassette_name: "basic_chat" } do
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

  describe "#generate_word_data" do
    let(:word_limit) { 5 }
    let(:service) { OpenaiApiService.new(logger:, validator:, word_limit:) }
    let(:word_list) { OpenaiApiService::WordList.new }

    context "when submitting an invalid word_list" do
      it "raises a TypeError when word_list is nil" do
        expect { service.generate_word_data(nil) }.to raise_error(TypeError)
      end

      it "raises a TypeError when word_list is an array" do
        expect { service.generate_word_data(%w[aioli alit allay]) }.to raise_error(TypeError)
      end
    end

    context "when word set length >= word limit" do
      before do
        word_list.word_set.merge(sample_words.take(5))
      end

      it "returns word_list" do
        expect(service.generate_word_data(word_list)).to eq(word_list)
      end

      it "returns word_list with the same number of words" do
        num_of_words_before = word_list.word_set.length
        num_of_words_after = service.generate_word_data(word_list).word_set.length
        expect(num_of_words_after).to eq(num_of_words_before)
      end

      it "returns word_list with the WORD_LIST_FULL_FRESH message" do
        returned_message = service.generate_word_data(word_list).log_message&.message
        expected_message = OpenaiApiService::Messages::WORD_LIST_FULL_FRESH
        expect(returned_message).to eq(expected_message)
      end
    end

    context "when no words are found for the given puzzle ID" do
      let(:empty_relation) { Word.none }

      before do
        allow(Word).to receive_message_chain(:joins, :where, :order).and_return(empty_relation)
      end

      it "returns word_list" do
        expect(service.generate_word_data(word_list)).to eq(word_list)
      end

      it "returns word_list with the PUZZLE_WORDS_EMPTY message" do
        returned_message = service.generate_word_data(word_list).log_message&.message
        expected_message = OpenaiApiService::Messages::PUZZLE_WORDS_EMPTY
        expect(returned_message).to eq(expected_message)
      end
    end

    context "when the word limit is reached while looping through puzzle words" do
      let(:extra_word) { sample_words[5] }
      let(:puzzle_words) { words_from_strings(0..5) }

      before do
        allow(Word).to receive_message_chain(:joins, :where, :order).and_return(puzzle_words)
        word_list.word_set.merge(sample_words.take(word_limit - 1))
      end

      it "returns word_list" do
        expect(service.generate_word_data(word_list)).to eq(word_list)
      end

      it "adds one word to word_list.word_set" do
        num_of_words_before = word_list.word_set.length
        num_of_words_after = service.generate_word_data(word_list).word_set.length
        expect(num_of_words_after - num_of_words_before).to eq(1)
      end

      it "returns word_list.word_set with length equal to word_limit" do
        list_length = service.generate_word_data(word_list).word_set.length
        expect(list_length).to eq(word_limit)
      end

      it "returns word_list with the WORD_LIST_FULL message" do
        returned_message = service.generate_word_data(word_list).log_message&.message
        expected_message = OpenaiApiService::Messages::WORD_LIST_FULL
        expect(returned_message).to eq(expected_message)
      end

      it "doesn't add words from puzzle_words that are out of range based on word_limit" do
        expect(service.generate_word_data(word_list).word_set).not_to include(extra_word)
      end
    end

    context "when looping through puzzle words" do
      let(:hint_words) { sample_words.slice(0, 5) }
      let(:non_hint_words) { sample_words.slice(5, 5) }
      # Make half of the puzzle words have hints, which should prevent them from being added to the
      # word list
      let(:words_with_hints) { words_from_strings(0, 5, with_hints: true) }
      let(:words_without_hints) { words_from_strings(5, 5) }
      let(:puzzle_words) { [*words_with_hints, *words_without_hints] }

      before do
        allow(Word).to receive_message_chain(:joins, :where, :order).and_return(puzzle_words)
      end

      it "returns word_list" do
        expect(service.generate_word_data(word_list)).to eq(word_list)
      end

      it "doesn't add words to word_list.word_set that already have hints" do
        word_set_after = service.generate_word_data(word_list).word_set
        includes_any_hint_words = hint_words.any? { |word| word_set_after.include?(word) }
        expect(includes_any_hint_words).to be(false)
      end

      it "adds words to word_list.word_set that don't have hints" do
        word_set_after = service.generate_word_data(word_list).word_set
        includes_all_non_hint_words = non_hint_words.all? { |word| word_set_after.include?(word) }
        expect(includes_all_non_hint_words).to be(true)
      end
    end

    context "when it checks all the words for a puzzle" do
      let(:first_puzzle_id) { 1 }
      let(:first_puzzle_words) { words_from_strings(0, 4) }
      let(:second_puzzle_words) { words_from_strings(4, 4) }
      let(:third_puzzle_words) { words_from_strings(8, 4) }

      before do
        word_list.puzzle_id = first_puzzle_id
        word_list.word_set = Set.new
        allow(Word).to receive_message_chain(:joins, :where, :order)
          .and_return(first_puzzle_words, second_puzzle_words, third_puzzle_words)
      end

      it "returns word_list.puzzle_id incremented by 1 when size limit reached in next puzzle" do
        new_puzzle_id = service.generate_word_data(word_list).puzzle_id
        expect(new_puzzle_id).to eq(first_puzzle_id + 1)
      end

      it "returns word_list.puzzle_id incremented by 2 when size limit reached in 2 puzzles" do
        custom_service = OpenaiApiService.new(logger:, validator:, word_limit: 10)
        new_puzzle_id = custom_service.generate_word_data(word_list).puzzle_id
        expect(new_puzzle_id).to eq(first_puzzle_id + 2)
      end
    end
  end

  describe "#generate_message_content" do
    let(:service) { OpenaiApiService.new(logger:, validator:) }
    let(:word_list) { OpenaiApiService::WordList.new }
    # stuff
  end
end
