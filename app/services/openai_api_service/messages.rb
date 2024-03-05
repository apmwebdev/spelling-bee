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
  # Module to define messages passed to logger. Keeping them here allows for easier testing
  module Messages
    extend self

    WORD_LIST_FULL = "Word list is full. Exiting from `puzzle_words` loop."
    WORD_LIST_FULL_FRESH = "Word list is full. Exiting before `puzzle_words` loop."
    PUZZLE_WORDS_EMPTY = "Words not found for puzzle"
    SAVE_HINTS_LENGTH_STATIC = "word_hints length is"
    SAVE_HINTS_FINISHED = "Finished saving word hints"
    SAVE_HINT_REQUEST_SUCCESS = "Hint request saved successfully"
    FETCH_HINTS_START_STATIC = "Starting iteration. batch_state ="
    FETCH_HINTS_REQUEST_CAPPED = "Request limit reached. Exiting"
    FETCH_HINTS_EMPTY_WORD_LIST = "Empty word_list. Exiting"
    FETCH_HINTS_SUCCESSFUL_RESPONSE = "Successful response: parsed_response.word_hints is not nil"

    def save_hints_length(length)
      "#{SAVE_HINTS_LENGTH_STATIC} #{length}"
    end

    def fetch_hints_start(batch_state)
      "#{FETCH_HINTS_START_STATIC} #{batch_state.to_loggable_hash}"
      # FETCH_HINTS_START_STATIC
    end
  end
end
