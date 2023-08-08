class Api::V1::UserPrefsController < AuthRequiredController
  before_action :set_user_pref, only: %i[ show update destroy ]

  # GET /user_prefs/1
  def show
    render json: @user_pref
  end

  # POST /user_prefs
  def create
    @user_pref = UserPref.new(user_pref_params)

    if @user_pref.save
      render json: @user_pref, status: :created, location: @user_pref
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_prefs/1
  def update
    if @user_pref.update(user_pref_params)
      render json: @user_pref
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_pref
      @user_pref = UserPref.find_by_user_id(params[:user_id])
    end

    # Only allow a list of trusted parameters through.
    def user_pref_params
      params.require(:user_id).permit(:color_scheme)
    end
end
