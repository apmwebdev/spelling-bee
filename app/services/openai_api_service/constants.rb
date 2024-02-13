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

class OpenaiApiService
  module Constants
    # Default limit for the number of words per request to get hints for. This number is based on
    # the limits of the model being used, which is `gpt-3.5-turbo-0125`. This model has 3 limits:
    # 1. 250,000 tokens per minute
    # 2. 3,000 requests per minute
    # 3. 4,096 tokens per response
    # Of these, the 4k tokens/response is the most limiting. With a word limit of 140, each response
    # should be ~3k tokens, falling well under the limit with some wiggle room.
    DEFAULT_WORD_LIMIT = 140

    # The minimum remaining tokens needed for a hint request to be sent.
    MINIMUM_REMAINING_TOKENS = 15_000

    # After tokens/response, the next most limiting factor is tokens/minute. With the input tokens
    # and response tokens, each request + response cycle should be ~3600 tokens. With 60 requests,
    # that would be ~216,000 tokens. Because the requests are not being batched and each request
    # takes several seconds, however, there's no way the TPM limit should ever be reached.
    RPM_LIMIT = 60

    # Character limit for the stringified request content. This prevents accidentally sending a
    # massive request (for whatever reason). Nearly all of the token length of a request is taken up
    # here. With a word limit of 140 words, the content length should be ~2000 characters.
    CONTENT_CHAR_LIMIT = 3000

    # Which AI model to use for requests if none is specified manually. The different models are
    # listed here:
    # https://platform.openai.com/docs/models/models
    # The limits for the different models are shown here: https://platform.openai.com/account/limits
    DEFAULT_AI_MODEL = "gpt-3.5-turbo-0125"

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
  end
end
