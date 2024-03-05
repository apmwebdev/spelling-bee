# frozen_string_literal: true

class OpenaiApiService
  module Constants
    # Default limit for the number of words per request to get hints for. This number is based on
    # the limits of the model being used, which is `gpt-3.5-turbo-0125`. This model has 3 limits:
    # 1. 60,000 tokens per minute
    # 2. 500 requests per minute
    # 3. 4,096 tokens per response
    # Of these, the 4k tokens/response is the most limiting. With a word limit of 140, each response
    # should be ~3k tokens, falling well under the limit with some wiggle room.
    DEFAULT_WORD_LIMIT = 140

    # The minimum remaining tokens needed for a hint request to be sent.
    MINIMUM_REMAINING_TOKENS = 15_000

    # Character limit for the stringified request content. This prevents accidentally sending a
    # massive request (for whatever reason). Nearly all of the token length of a request is taken up
    # here. With a word limit of 140 words, the content length should be ~2000 characters.
    CONTENT_CHAR_LIMIT = 3000

    # Which AI model to use for requests if none is specified manually. The different models are
    # listed here:
    # https://platform.openai.com/docs/models/models
    # The limits for the different models are shown here: https://platform.openai.com/account/limits
    DEFAULT_AI_MODEL = "gpt-3.5-turbo-0125"

    RETRY_COUNT_SLEEP_TIMES = [0, 60, 300].freeze

    # Headers from the API responses to save
    RELEVANT_HEADERS = [
      "openai-processing-ms",
      "openai-version",
      "x-ratelimit-limit-requests",
      "x-ratelimit-limit-tokens",
      "x-ratelimit-remaining-requests",
      "x-ratelimit-remaining-tokens",
      "x-ratelimit-reset-requests",
      "x-ratelimit-reset-tokens",
      "x-request-id",
    ].freeze

    DEFAULT_HEADERS = [
      "date",
      "content-type",
      "transfer-encoding",
      "connection",
      "access-control-allow-origin",
      "cache-control",
      "strict-transport-security",
      # "content-encoding",
      "server",
    ].freeze

    EXPECTED_HEADERS = [
      "openai-model",
      "openai-organization",
      *DEFAULT_HEADERS,
      *RELEVANT_HEADERS,
    ].freeze
  end
end
