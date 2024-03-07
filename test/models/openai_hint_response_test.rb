require "test_helper"

class OpenaiHintResponseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# == Schema Information
#
# Table name: openai_hint_responses
#
#  id                             :bigint           not null, primary key
#  openai_hint_request_id         :bigint           not null
#  word_hints                     :jsonb            is an Array
#  chat_completion_id             :string
#  system_fingerprint             :string
#  openai_created_timestamp       :datetime
#  res_ai_model                   :string
#  prompt_tokens                  :integer
#  completion_tokens              :integer
#  total_tokens                   :integer
#  response_time_seconds          :float
#  openai_processing_ms           :integer
#  openai_version                 :string
#  x_ratelimit_limit_requests     :integer
#  x_ratelimit_limit_tokens       :integer
#  x_ratelimit_remaining_requests :integer
#  x_ratelimit_remaining_tokens   :integer
#  x_ratelimit_reset_requests     :string
#  x_ratelimit_reset_tokens       :string
#  x_request_id                   :string
#  http_status                    :integer
#  error_body                     :jsonb
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  finish_reason                  :string
#
# Indexes
#
#  index_openai_hint_responses_on_error_body              (error_body) USING gin
#  index_openai_hint_responses_on_openai_hint_request_id  (openai_hint_request_id)
#  index_openai_hint_responses_on_word_hints              (word_hints) USING gin
#
# Foreign Keys
#
#  fk_rails_...  (openai_hint_request_id => openai_hint_requests.id)
#
