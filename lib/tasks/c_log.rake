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

namespace :c_log do
  desc "Run #logs"
  task logs: :environment do
    logger = ContextualLogger.new($stdout, global_puts_only: true)
    driver = ContextualLoggerDriver.new
    begin
      driver.logs
    rescue StandardError => e
      logger.exception(e, :fatal, additional_message: "That caused an error: ")
    end
  end
end
