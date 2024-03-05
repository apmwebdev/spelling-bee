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

namespace :openai do
  desc "Seed hints"
  task seed_hints: :environment do
    service = OpenaiApiService.new
    service.logger.global_puts_and.push(:info, :warn)
    service.seed_hints
  end
end
