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