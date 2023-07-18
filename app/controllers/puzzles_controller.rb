class PuzzlesController < ApplicationController
  before_action :set_puzzle, only: %i[ show update destroy ]

  # GET /puzzles
  def index
    @puzzles = Puzzle.all

    render json: @puzzles
  end

  # GET /puzzles/1
  def show
    render json: @puzzle
  end

  # POST /puzzles
  def create
    @puzzle = Puzzle.new(puzzle_params)

    if @puzzle.save
      render json: @puzzle, status: :created, location: @puzzle
    else
      render json: @puzzle.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /puzzles/1
  def update
    if @puzzle.update(puzzle_params)
      render json: @puzzle
    else
      render json: @puzzle.errors, status: :unprocessable_entity
    end
  end

  # DELETE /puzzles/1
  def destroy
    @puzzle.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_puzzle
      @puzzle = Puzzle.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def puzzle_params
      params.require(:puzzle).permit(:date, :center_letter, :outer_letters, :origin)
    end
end
