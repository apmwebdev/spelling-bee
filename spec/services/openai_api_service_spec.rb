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

RSpec.describe OpenaiApiService do
  include_context "word lists"
  fixtures :openai_hint_instructions

  let(:logger) { ContextualLogger.new(IO::NULL, global_puts_and: false) }
  let(:validator) { OpenaiApiService::Validator.new(logger) }
  let(:instructions) { openai_hint_instructions(:valid_instructions) }
  let(:ai_model) { OpenaiApiService::Constants::DEFAULT_AI_MODEL }

  describe "#send_request" do
    let(:service) { OpenaiApiService.new(logger:, validator:) }

    context "when submitting invalid content" do
      it "raises a TypeError when content is not a string", :aggregate_failures do
        expect { service.send_request(nil) }.to raise_error(TypeError)
        expect { service.send_request(%w[foo bar]) }.to raise_error(TypeError)
        expect { service.send_request({ foo: "foo", bar: "bar" }) }.to raise_error(TypeError)
        expect { service.send_request(123) }.to raise_error(TypeError)
      end

      it "raises a TypeError when content is an empty string" do
        expect { service.send_request("") }.to raise_error(TypeError)
      end

      it "raises a TypeError when content is too long" do
        long_content = Random.hex(OpenaiApiService::Constants::CONTENT_CHAR_LIMIT + 1)
        expect { service.send_request(long_content) }.to raise_error(TypeError)
      end
    end

    context "when submitting valid content", vcr: { cassette_name: "basic_chat" } do
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

    it "raises a TypeError when word_list is invalid", :aggregate_failures do
      expect { service.generate_word_data(nil) }.to raise_error(TypeError)
      expect { service.generate_word_data(%w[aioli alit allay]) }.to raise_error(TypeError)
      expect { service.generate_word_data("aioli, alit, allay") }.to raise_error(TypeError)
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

    context "when it finishes processing all the words for a puzzle" do
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
    let(:word_list) { OpenaiApiService::WordList.new(1, Set.new(sample_words.take(5))) }
    let(:word_list_string) { "aioli, alit, allay, allot, alloy\n" }
    let(:pre_word_list_text) { "Text before the word list" }
    let(:post_word_list_text) { "Text after the word list" }
    let(:instructions) { OpenaiHintInstruction.new(pre_word_list_text:, post_word_list_text:) }

    it "properly generates a message" do
      actual = service.generate_message_content(word_list, instructions)
      expected = "#{pre_word_list_text} #{word_list_string} #{post_word_list_text}"
      expect(actual).to eq(expected)
    end
  end

  describe "#save_hint" do
    let(:service) { OpenaiApiService.new(logger:, validator:) }

    context "when submitting an invalid word_hint" do
      it "raises an TypeError if word_hint is nil" do
        expect { service.save_hint(nil) }.to raise_error(TypeError)
      end

      it "raises a TypeError if word_hint[:hint] is missing, nil, or blank", :aggregate_failures do
        blank_hint = { word: "aioli", hint: "" }
        expect { service.save_hint(blank_hint) }.to raise_error(TypeError)
        missing_hint = { word: "aioli" }
        expect { service.save_hint(missing_hint) }.to raise_error(TypeError)
        nil_hint = { word: "aioli", hint: nil }
        expect { service.save_hint(nil_hint) }.to raise_error(TypeError)
      end
    end

    it "raises an ActiveRecord::RecordNotFound error if it can't find the word" do
      word_hint = { word: "invalid_word", hint: "hint" }
      allow(Word).to receive(:find).with(word_hint[:word]).and_raise(ActiveRecord::RecordNotFound)
      expect { service.save_hint(word_hint) }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "saves the hint if word and word_hint are valid" do
      sample_word = sample_words.first
      Word.create(text: sample_word)
      hint_text = "This is hint text"
      word_hint = { word: sample_word, hint: hint_text }
      service.save_hint(word_hint)
      word = Word.find(sample_word)

      expect(word.hint).to eq(hint_text)
    end
  end

  describe "#save_hints" do
    let(:service) { OpenaiApiService.new(logger:, validator:) }
    let(:hint_text) { "Hint for " }
    let(:five_words) { sample_words.first(5) }
    let(:word_hints) { five_words.map { |word| { word:, hint: hint_text + word } } }
    let(:invalid_word_hints) { [{ word: "word", hint: "hint" }, { word: "missing_hint" }] }

    it "raises a TypeError if word_hints is invalid", :aggregate_failures do
      expect { service.save_hints(nil) }.to raise_error(TypeError)
      expect { service.save_hints([]) }.to raise_error(TypeError)
      expect { service.save_hints(invalid_word_hints) }.to raise_error(TypeError)
    end

    context "when word_hints is valid" do
      let(:logger) { instance_double(ContextualLogger) }
      let(:validator) do
        instance_double(OpenaiApiService::Validator, valid_word_hints?: true,
          valid_word_hint?: true,)
      end
      let(:service) { OpenaiApiService.new(logger:, validator:) }

      before do
        word_hints.each { |wh| Word.create(text: wh[:word]) }
      end

      it "logs properly" do
        expect(logger).to receive(:info)
          .with(OpenaiApiService::Messages.save_hints_length(word_hints.length)).ordered
        expect(logger).to receive(:info)
          .with(OpenaiApiService::Messages::SAVE_HINTS_FINISHED).ordered
        service.save_hints(word_hints)
      end

      it "adds hints to all all words in array", :aggregate_failures do
        allow(logger).to receive(:info)
        before_hint_count = Word.where.not(hint: nil).count
        service.save_hints(word_hints)
        after_hint_count = Word.where.not(hint: nil).count

        expect(before_hint_count).to be(0)
        expect(after_hint_count).to be(word_hints.length)
      end
    end
  end

  describe "#save_hint_request" do
    let(:logger) { instance_double(ContextualLogger, info: nil) }
    let(:validator) { OpenaiApiService::Validator.new(logger) }
    let(:service) { OpenaiApiService.new(logger:, validator:) }
    let(:valid_word_list) do
      wl = OpenaiApiService::WordList.new
      wl.word_set = Set.new(sample_words.take(5))
      wl
    end
    # let(:valid_instructions) { openai_hint_instructions(:valid_instructions) }
    let(:valid_ai_model) { OpenaiApiService::Constants::DEFAULT_AI_MODEL }

    it "raises a TypeError when word_list has no words" do
      empty_word_list = OpenaiApiService::WordList.new
      expect { service.save_hint_request(empty_word_list, instructions, valid_ai_model) }
        .to raise_error(TypeError)
    end

    it "raises a TypeError when word_list is otherwise invalid", :aggregate_failures do
      valid_args = [instructions, valid_ai_model]
      expect { service.save_hint_request(nil, *valid_args) }.to raise_error(TypeError)
      expect { service.save_hint_request([], *valid_args) }.to raise_error(TypeError)
      expect { service.save_hint_request({}, *valid_args) }.to raise_error(TypeError)
    end

    it "raises a TypeError when instructions is invalid", :aggregate_failures do
      expect { service.save_hint_request(valid_word_list, nil, valid_ai_model) }
        .to raise_error(TypeError)
      expect { service.save_hint_request(valid_word_list, "foo", valid_ai_model) }
        .to raise_error(TypeError)
      expect { service.save_hint_request(valid_word_list, %w[foo bar], valid_ai_model) }
        .to raise_error(TypeError)
      expect { service.save_hint_request(valid_word_list, {}, valid_ai_model) }
        .to raise_error(TypeError)
    end

    it "raises a TypeError when ai_model is invalid", :aggregate_failures do
      valid_args = [valid_word_list, instructions]
      expect { service.save_hint_request(*valid_args, nil) }.to raise_error(TypeError)
      expect { service.save_hint_request(*valid_args, 123) }.to raise_error(TypeError)
      expect { service.save_hint_request(*valid_args, %w[foo bar]) }.to raise_error(TypeError)
      expect { service.save_hint_request(*valid_args, {}) }.to raise_error(TypeError)
    end

    context "when arguments are valid" do
      let(:valid_args) { [valid_word_list, instructions, valid_ai_model] }

      it "logs success message" do
        expect(logger).to receive(:info).with(OpenaiApiService::Messages::SAVE_HINT_REQUEST_SUCCESS)
        service.save_hint_request(*valid_args)
      end

      it "saves an OpenaiHintRequest" do
        expect { service.save_hint_request(*valid_args) }
          .to change(OpenaiHintRequest, :count).by(1)
      end

      it "returns an OpenaiHintRequest" do
        expect(service.save_hint_request(*valid_args)).to be_a(OpenaiHintRequest)
      end

      it "returns an OpenaiHintRequest with expected properties", :aggregate_failures do
        result = service.save_hint_request(*valid_args)
        expect(result.req_ai_model).to eq(valid_ai_model)
        expect(result.word_list).to eq(valid_word_list.word_set.to_a)
        expect(result.openai_hint_instruction).to be(instructions)
      end
    end
  end

  describe "#save_hint_response" do
    let(:word_limit) { 20 }
    let(:service) { OpenaiApiService.new(logger:, validator:, word_limit:) }
    let(:word_list) { OpenaiApiService::WordList.new(1, sample_words.take(word_limit)) }
    let(:full_word_list) { service.generate_word_data(word_list) }
    let(:message_content) { service.generate_message_content(full_word_list, instructions) }
    let(:request_record) { service.save_hint_request(full_word_list, instructions, ai_model) }
    let(:wrapped_response) do
      VCR.use_cassette("hint_request_20") do
        service.send_request(message_content, ai_model:)
      end
    end
    let(:parsed_response) do
      OpenaiApiService::ParsedResponse.new(logger, validator, wrapped_response)
    end

    it "saves an OpenaiHintResponse when passed valid arguments" do
      expect { service.save_hint_response(parsed_response, request_record) }
        .to change(OpenaiHintResponse, :count).by(1)
    end
  end

  describe "#log_and_send_request", vcr: { cassette_name: "hint_request_20" } do
    let(:word_limit) { 20 }
    let(:service) { OpenaiApiService.new(logger:, validator:, word_limit:) }
    let(:word_list) { OpenaiApiService::WordList.new(1, sample_words.take(word_limit)) }
    let(:full_word_list) { service.generate_word_data(word_list) }
    let(:expected_result) { service.log_and_send_request(full_word_list) }

    context "when valid arguments are passed in" do
      it "saves an OpenaiHintRequest" do
        expect { expected_result }.to change(OpenaiHintRequest, :count).by(1)
      end

      it "saves an OpenaiHintResponse" do
        expect { expected_result }.to change(OpenaiHintResponse, :count).by(1)
      end

      it "returns a ParsedResponse" do
        expect(expected_result).to be_a(OpenaiApiService::ParsedResponse)
      end

      describe "the returned ParsedResponse" do
        it "set @word_hints to an array" do
          expect(expected_result.word_hints).to be_a(Array)
        end

        it "has @word_hints.length equal to the length of the passed in word set" do
          expect(expected_result.word_hints.length).to eq(full_word_list.word_set.length)
        end

        it "has @word_hints with only word_hint objects" do
          word_hints_valid = validator.valid_word_hints?(expected_result.word_hints)
          expect(word_hints_valid).to be(true)
        end

        it "has a nil @error_body" do
          expect(expected_result.error_body).to be_nil
        end
      end
    end

    context "when invalid arguments are passed in" do
      it "raises a TypeError when passed an empty word_list" do
        empty_word_list = OpenaiApiService::WordList.new
        expect { service.log_and_send_request(empty_word_list) }.to raise_error(TypeError)
      end

      it "raises a TypeError when passed an invalid word_list", :aggregate_failures do
        expect { service.log_and_send_request(nil) }.to raise_error(TypeError)
        expect { service.log_and_send_request([]) }.to raise_error(TypeError)
        expect { service.log_and_send_request({}) }.to raise_error(TypeError)
        expect { service.log_and_send_request("foo") }.to raise_error(TypeError)
        expect { service.log_and_send_request(%w[foo bar]) }.to raise_error(TypeError)
      end
    end
  end

  describe "#seed_answer_hints" do
  end
end
