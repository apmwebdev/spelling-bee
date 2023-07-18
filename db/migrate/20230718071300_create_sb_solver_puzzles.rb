class CreateSbSolverPuzzles < ActiveRecord::Migration[7.0]
  def change
    create_table :sb_solver_puzzles do |t|
      t.string :sb_solver_id

      t.timestamps
    end
  end
end
