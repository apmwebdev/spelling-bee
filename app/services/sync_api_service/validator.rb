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

class SyncApiService
  # Validates puzzle data returned from the Sync API
  class Validator < ExternalServiceValidatorBase
    def initialize(logger)
      super
      @puzzle_validator = PuzzleJsonValidator.new(logger)
    end

    def valid_puzzle_response!(json)
      @logger.info "Beginning Sync API puzzle response validation..."
      valid_hash!(json, [
        [:data, Array, ->(prop) { valid_puzzle_response_data?(prop) }],
        [:last_id, Integer, ->(prop) { PuzzleIdentifierService.validate_id_format(prop) }],
      ], display_name: "puzzle_response",)
    end

    def valid_puzzle_response_data?(json)
      raise TypeError, "json must be an array: #{json}" unless json.is_a?(Array)
      raise TypeError, "Some items are invalid" unless json.all? { |item| valid_data_item?(item) }
      return true
    rescue TypeError => e
      @logger.exception e
      return false
    end

    def valid_data_item?(json)
      valid_hash?(json, [
        ["puzzle_data", Hash, ->(p) { @puzzle_validator.valid_sync_api_puzzle?(p) }],
        ["origin_data", Hash, ->(p) { valid_nyt_origin_data?(p) || valid_sb_solver_origin_data?(p) }],
        ["answer_words", Array, ->(p) { @puzzle_validator.valid_word_array?(p) }],
      ], display_name: "data_item",)
    end

    def valid_nyt_origin_data?(json)
      valid_hash?(json, [
        ["created_at", String, ->(p) { valid_date?(p) }],
        ["id", Integer],
        ["json_data", Hash],
        ["nyt_id", Integer],
        ["updated_at", String, ->(p) { valid_date?(p) }],
      ], display_name: "origin_data",)
    end

    def valid_sb_solver_origin_data?(json)
      valid_hash?(json, [
        ["created_at", String, ->(p) { valid_date?(p) }],
        ["id", Integer],
        ["sb_solver_id", Integer],
        ["updated_at", String, ->(p) { valid_date?(p) }],
      ], display_name: "origin_data",)
    end

    def valid_hint_response!(response)
      valid_hash!(response, [
        [:data, Array, ->(p) { valid_word_hints!(p) }],
        [:page, Integer, ->(p) { !p.negative? }],
      ], display_name: "hint_response",)
    end

    def valid_word_hints!(array)
      OpenaiApiService::Validator.new(@logger).valid_word_hints!(array)
    end
  end
end