class Api::V1::GuessesController < AuthRequiredController
  before_action :set_guess, only: %i[ show update destroy ]

  # POST /guesses
  def create
    @guess = Guess.new(guess_params)

    if @guess.save
      render json: @guess, status: :created, location: @guess
    else
      render json: @guess.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_guess
      @guess = Guess.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def guess_params
      params.require(:guess).permit(:user_id, :puzzle_id, :text, :is_spoiled)
    end
end
