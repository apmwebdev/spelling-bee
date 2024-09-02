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

# :nodoc:
module PuzzleDataResetter
  def self.delete_puzzle_data
    Answer.delete_all
    ActiveRecord::Base.connection.reset_pk_sequence!("answers")
    Puzzle.delete_all
    ActiveRecord::Base.connection.reset_pk_sequence!("puzzles")
    SbSolverPuzzle.delete_all
    ActiveRecord::Base.connection.reset_pk_sequence!("sb_solver_puzzles")
    NytPuzzle.delete_all
    ActiveRecord::Base.connection.reset_pk_sequence!("nyt_puzzles")
  end
end
