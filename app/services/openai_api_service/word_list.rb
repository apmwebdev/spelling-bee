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

    attr_accessor :puzzle_id, :word_set
    attr_reader :log_message

    ##
    # @param [Integer] starting_puzzle_id
    # @param [Set] word_set
    def initialize(starting_puzzle_id = 1, word_set = Set.new)
      @puzzle_id = starting_puzzle_id.to_i
      @word_set = word_set
      @log_message = nil
    end

    ##
    # @param [#to_s, LogMessage] msg
    # @param [Symbol] severity
    # @param [Boolean] auto_trace
    def log_message=(msg, severity: :info, auto_trace: false)
      @log_message = msg.is_a?(LogMessage) ? msg : LogMessage.new(msg, severity:, auto_trace:)
    end
  end
end
