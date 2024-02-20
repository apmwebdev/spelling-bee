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
  # Data object for holding the state of the API request batches
  class BatchState
    include Constants
    include Loggable

    attr_reader :request_count, :remaining_requests, :reset_requests_s, :remaining_tokens,
      :reset_tokens_s, :puzzle_id, :word_set, :retry_count

    # @param logger
    # @param request_count [Integer]
    # @param remaining_requests [Integer]
    # @param reset_requests_s [Integer]
    # @param remaining_tokens [Integer]
    # @param reset_tokens_s [Integer]
    # @param retry_count [Integer]
    def initialize(logger, request_count: 0, remaining_requests: nil, reset_requests_s: nil,
                   remaining_tokens: nil, reset_tokens_s: nil, retry_count: 0)
      self.logger = logger
      self.request_count = request_count
      self.remaining_requests = remaining_requests
      self.reset_requests_s = reset_requests_s
      self.remaining_tokens = remaining_tokens
      self.reset_tokens_s = reset_tokens_s
      self.retry_count = retry_count
    end

    ##
    # @param res [ParsedResponse]
    def update_from_response(res)
      raise TypeError, "Invalid response: #{res}" unless res.is_a?(ParsedResponse)

      @logger.debug("Headers: #{res.headers}", puts_only: true)

      @request_count += 1
      self.remaining_requests = res.headers["x-ratelimit-remaining-requests"]
      self.remaining_tokens = res.headers["x-ratelimit-remaining-tokens"]
      self.reset_requests_s = calculate_seconds(res.headers["x-ratelimit-reset-requests"])
      self.reset_tokens_s = calculate_seconds(res.headers["x-ratelimit-reset-tokens"])
    end

    def calculate_seconds(value)
      pattern = /(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)m)?(?:(?<seconds>\d+)s)?(?:(?<millis>\d+)ms)?/
      return nil if value.nil?

      matches = value.match(pattern)
      hours = matches[:hours].to_f
      minutes = matches[:minutes].to_f
      seconds = matches[:seconds].to_f
      millis = matches[:millis].to_f

      (hours * 3600) + (minutes * 60) + seconds + (millis / 1000)
    end

    def sleep_from_retries
      return 0 if @retry_count == 0 || @retry_count.nil?
      return 60 if @retry_count == 1
      return (60 * 5) if @retry_count == 2
      raise StandardError, "Can't connect to API"
    end

    def to_hash
      instance_variables.each_with_object({}) do |var, hash|
        hash[var.to_s.delete("@")] = instance_variable_get(var)
      end
    end

    # Setters

    def logger=(value)
      if value.is_a?(ContextualLogger)
        @logger = value
      else
        @logger ||= ContextualLogger.new("log/open_ai_api.log", "weekly")
        @logger.error "@logger must be a ContextualLogger. Passed #{value}"
      end
    end

    def request_count=(value)
      maybe_set_non_neg_int(:@request_count, value, default: 0)
    end

    def remaining_requests=(value)
      maybe_set_non_neg_int(:@remaining_requests, value)
    end

    def reset_requests_s=(value)
      if value.nil?
        @reset_requests_s = nil
      elsif (value.is_a?(Float) && value.zero?) || value.to_f.positive?
        @reset_requests_s = value.to_f
      end
    end

    def remaining_tokens=(value)
      maybe_set_non_neg_int(:@remaining_tokens, value)
    end

    def reset_tokens_s=(value)
      if value.nil?
        @reset_tokens_s = nil
      elsif (value.is_a?(Float) && value.zero?) || value.to_f.positive?
        @reset_tokens_s = value.to_f
      end
    end

    def retry_count=(value)
      maybe_set_non_neg_int(:@retry_count, value, default: 0)
    end

    private

    def maybe_set_non_neg_int(var, value, default: nil)
      if value.nil? && default.nil?
        instance_variable_set(var, nil)
      elsif (value.is_a?(Integer) && value.zero?) || value.to_i.positive?
        instance_variable_set(var, value.to_i)
      else
        instance_variable_set(var, default) unless default.nil?
        msg = "#{var} must be#{default.nil? ? ' nil or' : ''} a non-negative integer. Passed "\
          "#{value}"
        @logger.error msg
      end
    end
  end
end
