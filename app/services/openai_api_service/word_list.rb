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
  # The word list for sending to the OpenAI API for hints. Meant to be used as a data object that
  # the recursive OpenaiApiService#generate_word_data method can pass to itself to build up word
  # lists across multiple puzzles and multiple requests.
  class WordList
    include Loggable

    attr_reader :puzzle_id, :word_set, :log_message

    ##
    # @param [Integer] starting_puzzle_id
    # @param [Set] word_set
    def initialize(starting_puzzle_id = 1, word_set = Set.new, log_message = nil)
      self.puzzle_id = starting_puzzle_id
      self.word_set = word_set
      self.log_message = log_message
    end

    def puzzle_id=(value)
      @puzzle_id = value.to_i.positive? ? value.to_i : 1
    end

    def word_set=(value)
      @word_set =
        if value.is_a?(Set) && value.all? { |item| item.is_a?(String) }
          value
        elsif value.is_a?(Array) && value.all? { |item| item.is_a?(String) }
          Set.new(value)
        else
          Set.new
        end
    end

    ##
    # @param [#to_s, LogMessage] msg
    # @param [Symbol] severity
    # @param [Boolean] auto_trace
    def log_message=(msg, severity: :info, auto_trace: false)
      @log_message =
        if msg.is_a?(LogMessage) || msg.nil?
          msg
        else
          LogMessage.new(msg, severity:, auto_trace:)
        end
    end
  end
end
