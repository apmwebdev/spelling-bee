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
#  ai_model                       :string
#  completion_tokens              :integer
#  error_json                     :jsonb
#  http_status                    :integer
#  openai_created_timestamp       :datetime
#  openai_processing_ms           :integer
#  openai_version                 :string
#  prompt_tokens                  :integer
#  response_time_ms               :integer
#  system_fingerprint             :string
#  total_tokens                   :integer
#  x_ratelimit_limit_requests     :integer
#  x_ratelimit_limit_tokens       :integer
#  x_ratelimit_remaining_requests :integer
#  x_ratelimit_remaining_tokens   :integer
#  x_ratelimit_reset_requests     :string
#  x_ratelimit_reset_tokens       :string
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  chat_completion_id             :string
#  openai_hint_request_id         :bigint           not null
#  x_request_id                   :string
#
# Indexes
#
#  index_openai_hint_responses_on_error_json              (error_json) USING gin
#  index_openai_hint_responses_on_openai_hint_request_id  (openai_hint_request_id)
#
# Foreign Keys
#
#  fk_rails_...  (openai_hint_request_id => openai_hint_requests.id)
#
