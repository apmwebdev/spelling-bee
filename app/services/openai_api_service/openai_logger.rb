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
  # Shortcut for setting the logger even if none is passed in
  module OpenaiLogger
    def determine_logger(input_logger)
      return input_logger if input_logger.is_a?(ContextualLogger)
      ContextualLogger.new("log/open_ai_api.log", "weekly")
    end
  end
end
