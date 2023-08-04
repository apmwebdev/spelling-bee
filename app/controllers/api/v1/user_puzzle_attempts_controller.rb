class Api::V1::UserPuzzleAttemptsController < AuthRequiredController
  before_action :set_user_puzzle_attempt, only: %i[ show update destroy ]

  # GET /user_puzzle_attempts
  def index
    @user_puzzle_attempts = UserPuzzleAttempt.all

    render json: @user_puzzle_attempts
  end

  # GET /user_puzzle_attempts/1
  def show
    render json: @user_puzzle_attempt
  end

  # POST /user_puzzle_attempts
  def create
    @user_puzzle_attempt = UserPuzzleAttempt.new(user_puzzle_attempt_params)

    if @user_puzzle_attempt.save
      render json: @user_puzzle_attempt, status: :created, location: @user_puzzle_attempt
    else
      render json: @user_puzzle_attempt.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_puzzle_attempts/1
  def update
    if @user_puzzle_attempt.update(user_puzzle_attempt_params)
      render json: @user_puzzle_attempt
    else
      render json: @user_puzzle_attempt.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_puzzle_attempts/1
  def destroy
    @user_puzzle_attempt.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_puzzle_attempt
      @user_puzzle_attempt = UserPuzzleAttempt.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_puzzle_attempt_params
      params.require(:user_puzzle_attempt).permit(:user_id, :puzzle_id)
    end
end
