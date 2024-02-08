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

# :nodoc:
class CreateOpenaiHintResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :openai_hint_responses do |t|
      t.references :openai_hint_request, null: false, foreign_key: true
      t.string :chat_completion_id
      t.string :system_fingerprint
      t.datetime :openai_created_timestamp
      t.string :ai_model
      t.integer :prompt_tokens
      t.integer :completion_tokens
      t.integer :total_tokens
      t.integer :response_time_ms
      t.integer :openai_processing_ms
      t.string :openai_version
      t.integer :x_ratelimit_limit_requests
      t.integer :x_ratelimit_limit_tokens
      t.integer :x_ratelimit_remaining_requests
      t.integer :x_ratelimit_remaining_tokens
      t.string :x_ratelimit_reset_requests
      t.string :x_ratelimit_reset_tokens
      t.string :x_request_id
      t.integer :http_status
      t.jsonb :error_json

      t.timestamps
    end
    add_index :openai_hint_responses, :error_json, using: "gin"
  end
end
