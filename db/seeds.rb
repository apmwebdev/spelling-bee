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

require "./db/seeds/seed_hint_profiles"

# WordsSeederService.seed_from_file

##
# Need to adjust arguments. First argument is SB Solver ID to start at
# which is typically 1 (the first puzzle). Second argument is ID to stop at.
# 1888 is July 9, 2023.

# SbSolverScraperService.seed_puzzles(1, 1888)

##
# Get latest puzzles from NYT directly. This will seed the current week and
# previous week only.

# NytScraperService.seed_all_puzzles_json

# SeedStatusTrackingOptions.seed

# SeedHintProfiles.seed
