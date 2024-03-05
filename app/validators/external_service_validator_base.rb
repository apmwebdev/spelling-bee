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

# Base class for creating validators for services that integrate external APIs.
class ExternalServiceValidatorBase
  include BasicValidator

  def initialize(logger)
    unless logger.is_a?(ContextualLogger)
      raise TypeError,
        "Logger passed to #{self.class.name} must be a ContextualLogger or RSpec double"\
          "Passed #{logger.class.name}: #{logger}"
    end
    @logger = logger
  end
end
