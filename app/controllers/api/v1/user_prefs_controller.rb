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

  # Might not be needed
  def get_current_hint_profile
    render json: @user_pref.current_hint_profile.to_front_end_complete
  end

  # Might not be needed
  def set_current_hint_profile
    if @user_pref.update(
      current_hint_profile_type: params[:current_hint_profile_type].to_s,
      current_hint_profile_id: params[:current_hint_profile_id].to_i
    )
      render json: @user_pref.current_hint_profile.to_front_end_complete
    end
  end

  private
    def set_user_pref
      @user_pref = UserPref.find_by_user_id(current_user.id)
    end

    def user_pref_params
      params.permit(:color_scheme, :current_hint_profile_type, :current_hint_profile_id)
    end
end
