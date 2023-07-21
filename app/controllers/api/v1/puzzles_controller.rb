class Api::V1::PuzzlesController < ApplicationController
  before_action :set_puzzle, only: %i[ show update destroy ]
  # before_action :set_puzzle_by_date_string, only: :show_by_date
  # before_action :set_puzzle_by_letters, only: :show_by_letters

  # GET /puzzles
  def index
    @puzzles = Puzzle.all

    render json: @puzzles
  end

  # GET /puzzles/1899 (by ID)
  # GET /puzzles/2023_07_20 (by date)
  # GET /puzzles/laehivy (by letters)
  def show
    render(json: @puzzle.to_front_end)
  end

  # GET /puzzles/latest
  # Get the latest puzzle and redirect to :show with tts date string
  def latest
    puzzle = Puzzle.includes(:answers).last
    puzzle_date_string = puzzle.date.strftime("%Y_%m_%d")
    redirect_to action: :show, identifier: puzzle_date_string
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
    # Find puzzle by ID, date string, or letters
    def set_puzzle
      identifier = params[:identifier].to_s

      # Date string format is yyyy_mm_dd, optionally without underscores.
      # Year must start with 20, then a 1 or 2, then any digit.
      # Month must start with a 0 or 1, then any digit.
      # Day must start with a 0, 1, 2, or 3, then any digit.
      # Months and days must be 0-padded (e.g., January is 01, not 1).
      date_regex = /^20[1-2]\d_?[0-1]\d_?[0-3]\d$/

      # Letter string format is exactly 7 letters, with any combination of
      # capitals and lowercase.
      letter_regex = /^[A-Za-z]{7}$/

      # If the identifier is a date string, delete any underscores from it, then
      # convert it to a date and find the puzzle that way.
      if identifier.match(date_regex)
        puzzle_date = Date.parse(identifier.delete("_"))
        @puzzle = Puzzle.includes(:answers, :words).find_by_date(puzzle_date)

        # If identifier is a letter string, check if there are any capital letters.
        # If there's exactly one, use that as the center letter. Otherwise, use
        # the first letter in the string as the center letter.
      elsif identifier.match(letter_regex)
        # What is the index of the first capital letter? Returns nil for none
        capital_index = /[A-Z]/ =~ identifier
        # How many capital letters are there?
        num_of_caps = identifier.count("A-Z")

        # If there are no capital letters or multiple capital letters, use the
        # first letter as the center letter.
        if capital_index.nil? || num_of_caps > 1
          @puzzle = Puzzle.includes(:answers, :words).find_by(
            center_letter: identifier.first.downcase,
            outer_letters: identifier[1..6].downcase.split("").sort
          )

          # Otherwise, there is exactly one capital letter, so use that as the
          # center letter.
        else
          center_letter = identifier[capital_index]
          @puzzle = Puzzle.includes(:answers, :words).find_by(
            center_letter: center_letter.downcase,
            outer_letters: identifier.delete(center_letter).downcase.split("").sort
          )
        end

        # Identifier isn't a date or letter string, so it must be an ID.
      else
        @puzzle = Puzzle.includes(:answers, :words).find(identifier.to_i)
      end
      @puzzle.set_derived_fields
    end

    # Only allow a list of trusted parameters through.
    def puzzle_params
      params.require(:puzzle).permit(:date, :center_letter, :outer_letters, :origin)
    end
end
