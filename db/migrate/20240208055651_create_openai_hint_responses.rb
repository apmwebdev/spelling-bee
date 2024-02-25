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
      t.references :openai_hint_request, null: false, foreign_key: true,
                                         comment: "The request associated with this response"
      t.jsonb :word_hints, array: true, default: [],
                           comment: "The array of word hints returned in the response."
      t.string :chat_completion_id,
               comment: "The 'id' field from the response body"
      t.string :system_fingerprint,
               comment: "The system fingerprint from the response body, indicating the exact "\
                 "configuration used by the system to generate the response"
      t.datetime :openai_created_timestamp,
                 comment: "The 'created' timestamp from the body of the response"
      t.string :res_ai_model,
               comment: "The AI model indicated in the body of the response. This *should* be the "\
                 "same as the one sent in the request, but I'm saving it here as well just in case."
      t.integer :prompt_tokens,
                comment: "The number of tokens in the request prompt"
      t.integer :completion_tokens,
                comment: "The number of tokens in the response"
      t.integer :total_tokens,
                comment: "The total number of tokens used for the request + response. This is "\
                  "redundant, but it's easier than trying to do generated columns with "\
                  "ActiveRecord, and this is data that seems useful to have at the database level."
      t.float :response_time_seconds,
              comment: "This is the round trip time of the request, as calculated from the app. "\
                "It takes a timestamp before the request is sent and another after, and then "\
                "calculates the difference between them."
      t.integer :openai_processing_ms,
                comment: "The amount of time the model took to generate the response, as returned "\
                  "in the 'openai-processing-ms' header."
      t.string :openai_version,
               comment: "The version of the model used (I think?). This is a different metric "\
                 "than the version number at the end of the model name, e.g., the '0125' in "\
                 "'gpt-3.5-turbo-0125'. This is a date and can be found in the 'openai-version' "\
                 "header."
      t.integer :x_ratelimit_limit_requests,
                comment: "'The maximum number of requests that are permitted before exhausting "\
                  "the rate limit.' Determined by the model used and the individual account "\
                  "limits. Sent in the 'x-ratelimit-limit-requests' header."
      t.integer :x_ratelimit_limit_tokens,
                comment: "'The maximum number of tokens that are permitted before exhausting the "\
                  "rate limit.' Determined by the model used and the individual account limits. "\
                  "Sent in the 'x-ratelimit-limit-tokens' header."
      t.integer :x_ratelimit_remaining_requests,
                comment: "'The remaining number of requests that are permitted before exhausting "\
                  "the rate limit.' Sent in the 'x-ratelimit-remaining-requests' header."
      t.integer :x_ratelimit_remaining_tokens,
                comment: "'The remaining number of tokens that are permitted before exhausting "\
                  "the rate limit.' Sent in the 'x-ratelimit-remaining-tokens' header."
      t.string :x_ratelimit_reset_requests,
               comment: "'The time until the rate limit (based on requests) resets to its initial "\
                 "state.' Sent in the 'x-ratelimit-reset-requests' header. This is a string with "\
                 "both numbers and units, e.g. '90ms' or '6m20s'."
      t.string :x_ratelimit_reset_tokens,
               comment: "'The time until the rate limit (based on tokens) resets to its initial "\
                 "state.' Sent in the 'x-ratelimit-reset-tokens' header. This is a string with "\
                 "both numbers and units, e.g. '90ms' or '6m20s'."
      t.string :x_request_id,
               comment: "A different ID than the one sent in the body of the response. Not sure "\
                 "what the difference is. Saving for good measure. Included in the "\
                 "'x-request-id' header."
      t.integer :http_status,
                comment: "The HTTP status code of the response, represented by just the integer."
      t.jsonb :error_body,
              comment: "If the API returns an error, many of the above fields will likely not be "\
                "included in the response/headers. Just save the whole response."

      t.timestamps
    end
    add_index :openai_hint_responses, :error_body, using: "gin"
    add_index :openai_hint_responses, :word_hints, using: "gin"
  end
end
