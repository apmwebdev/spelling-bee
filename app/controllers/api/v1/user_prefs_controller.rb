class Api::V1::UserPrefsController < AuthRequiredController
  before_action :set_user_pref

  # GET /user_prefs/1
  def show
    render json: @user_pref.to_front_end
  end

  # PATCH/PUT /user_prefs/1
  def update
    if @user_pref.update(user_pref_params)
      render json: @user_pref.to_front_end
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  private
    def set_user_pref
      @user_pref = UserPref.find_by_user_id(current_user.id)
    end

    def user_pref_params
      params.permit(:color_scheme)
    end
end
