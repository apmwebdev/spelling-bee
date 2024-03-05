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
    include OpenaiLogger
    include Constants
    include Loggable
    include BasicValidator

    attr_reader :request_count, :remaining_requests, :reset_requests_s, :remaining_tokens,
      :reset_tokens_s, :puzzle_id, :word_set, :retry_count

    # @param logger [ContextualLogger]
    # @param request_count [Integer]
    # @param remaining_requests [Integer]
    # @param reset_requests_s [Float]
    # @param remaining_tokens [Integer]
    # @param reset_tokens_s [Float]
    # @param retry_count [Integer]
    def initialize(logger, request_count: 0, remaining_requests: nil, reset_requests_s: 0.0,
                   remaining_tokens: nil, reset_tokens_s: 0.0, retry_count: 0)
      self.logger = logger
      self.remaining_requests = remaining_requests
      self.reset_requests_s = reset_requests_s
      self.remaining_tokens = remaining_tokens
      self.reset_tokens_s = reset_tokens_s
      self.retry_count = retry_count
      maybe_set_non_negative_num(:@request_count, request_count, Integer, default: 0)
    end

    # @param res [ParsedResponse]
    def update_from_response(res)
      valid_type!(res, ParsedResponse)

      increment_request_count
      self.remaining_requests = res.headers["x-ratelimit-remaining-requests"]
      self.remaining_tokens = res.headers["x-ratelimit-remaining-tokens"]
      self.reset_requests_s = calculate_seconds(res.headers["x-ratelimit-reset-requests"])
      self.reset_tokens_s = calculate_seconds(res.headers["x-ratelimit-reset-tokens"])
    end

    def calculate_seconds(value)
      return nil if value.nil?
      return value if value.is_a?(Float)
      valid_type!(value, String)

      # Time duration string pattern. Each section is optional and consists of a float or an
      # integer followed by a letter(s).
      pattern = /
        (?:(?<hours>\d+(?:\.\d+)?)h)?
        (?:(?<minutes>\d+(?:\.\d+)?)m(?!s))?
        (?:(?<seconds>\d+(?:\.\d+)?)s)?
        (?:(?<millis>\d+(?:\.\d+)?)ms)?
      /x
      matches = value.match(pattern)
      if matches[:hours].nil? && matches[:minutes].nil? && matches[:seconds].nil? &&
         matches[:millis].nil?

        return nil
      end

      hours = matches[:hours].to_f
      minutes = matches[:minutes].to_f
      seconds = matches[:seconds].to_f
      millis = matches[:millis].to_f
      (hours * 3600) + (minutes * 60) + seconds + (millis / 1000)
    end

    def sleep_time_from_retry_count
      return RETRY_COUNT_SLEEP_TIMES[0] if @retry_count.nil?
      raise StandardError, "Can't connect to API" if @retry_count >= RETRY_COUNT_SLEEP_TIMES.length
      RETRY_COUNT_SLEEP_TIMES[@retry_count]
    end

    # request_count doesn't get a setter because it should only ever be incremented.
    def increment_request_count
      @request_count += 1
    end

    # Setters

    def logger=(value)
      @logger = determine_logger(value)
    end

    def remaining_requests=(value)
      maybe_set_non_negative_num(:@remaining_requests, value, Integer)
    end

    def reset_requests_s=(value)
      maybe_set_non_negative_num(:@reset_requests_s, value, Float, default: 0)
    end

    def remaining_tokens=(value)
      maybe_set_non_negative_num(:@remaining_tokens, value, Integer)
    end

    def reset_tokens_s=(value)
      maybe_set_non_negative_num(:@reset_tokens_s, value, Float, default: 0)
    end

    def retry_count=(value)
      maybe_set_non_negative_num(:@retry_count, value, Integer, default: 0)
    end

    private

    # @param var [Symbol]
    # @param value [any]
    # @param expected_class [Class]
    # @param default [Integer, Float, nil]
    #
    # @return void
    def maybe_set_non_negative_num(var, value, expected_class, default: nil)
      valid_type!(var, Symbol)
      valid_type!(expected_class, Class, ->(p) { [Integer, Float].include?(p) })
      valid_type!(default, [Integer, Float, NilClass])

      cast_to_expected_class = ->(obj) { expected_class == Integer ? obj.to_i : obj.to_f }

      if (value.is_a?(Numeric) && value.zero?) || cast_to_expected_class.call(value).positive?
        return instance_variable_set(var, cast_to_expected_class.call(value))
      end

      instance_variable_set(var, default)
      return if value.nil?

      msg = "#{var} must be#{default.nil? ? ' nil or' : ''} a non-negative integer. Passed "\
        "#{value.class.name}: #{value}"
      @logger.error msg
    end
  end
end
