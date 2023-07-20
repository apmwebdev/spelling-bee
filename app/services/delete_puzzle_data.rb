# frozen_string_literal: true

module DeletePuzzleData
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