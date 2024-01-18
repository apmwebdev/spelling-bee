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

# Validates puzzle data returned from the Sync API
class SyncApiValidator < ExternalServiceValidatorBase
  def initialize(logger)
    super
    @puzzle_validator = PuzzleJsonValidator.new(logger)
  end

  def valid?(json)
    @logger.info "SyncApiValidator: Beginning Sync API response validation..."
    hash_properties_are_valid?(json, "response", [
      ["data", Array, ->(prop) { valid_response_data?(prop) }],
      ["last_id", Integer, ->(prop) { PuzzleIdentifierService.validate_id_format(prop) }],
    ],)
  end

  def valid_response_data?(json)
    error_base = "SyncApiValidator: response[\"data\"] is invalid"
    unless json.is_a?(Array)
      err_log "#{error_base}: Must be array: #{json}"
      return false
    end
    unless json.all? { |item| valid_data_item?(item) }
      err_log "#{error_base}: Some items are invalid"
      return false
    end
    return true
  end

  def valid_data_item?(json)
    hash_properties_are_valid?(json, "data_item", [
      ["puzzle_data", Hash, ->(p) { @puzzle_validator.valid_sync_api_puzzle?(p) }],
      ["origin_data", Hash, ->(p) { valid_nyt_origin_data?(p) || valid_sb_solver_origin_data?(p) }],
      ["answer_words", Array, ->(p) { @puzzle_validator.valid_word_array?(p) }],
    ],)
  end

  def valid_nyt_origin_data?(json)
    hash_properties_are_valid?(json, "origin_data", [
      ["created_at", String, ->(p) { valid_date?(p) }],
      ["id", Integer],
      ["json_data", String, ->(p) { valid_json?(p) }],
      ["nyt_id", Integer],
      ["updated_at", String, ->(p) { valid_date?(p) }],
    ],)
  end

  def valid_sb_solver_origin_data?(json)
    hash_properties_are_valid?(json, "origin_data", [
      ["created_at", String, ->(p) { valid_date?(p) }],
      ["id", Integer],
      ["sb_solver_id", Integer],
      ["updated_at", String, ->(p) { valid_date?(p) }],
    ],)
  end
end
