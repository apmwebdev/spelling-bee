class Api::V1::UserHintProfilesController < AuthRequiredController
  before_action :set_user_hint_profile, only: %i[ show update destroy ]

  def get_all_hint_profiles
    @user_hint_profiles = UserHintProfile.where(user_id: current_user.id).map do |profile|
      profile.to_front_end_basic
    end
    default_hint_profiles = DefaultHintProfile.all.map do |profile|
      profile.to_front_end
    end
    render json: {userHintProfiles: @user_hint_profiles, defaultHintProfiles: default_hint_profiles}
  end

  # GET /user_hint_profiles
  def index
    @user_hint_profiles = UserHintProfile.find_by_user_id(current_user.id)

    render json: @user_hint_profiles
  end

  # GET /user_hint_profiles/1
  def show

    render json: @user_hint_profile
  end

  # POST /user_hint_profiles
  def create
    @user_hint_profile = UserHintProfile.new(user_hint_profile_params)

    if @user_hint_profile.save
      render json: @user_hint_profile, status: :created, location: @user_hint_profile
    else
      render json: @user_hint_profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_hint_profiles/1
  def update
    if @user_hint_profile.update(user_hint_profile_params)
      render json: @user_hint_profile
    else
      render json: @user_hint_profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_hint_profiles/1
  def destroy
    @user_hint_profile.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_hint_profile
      profile = UserHintProfile.find(params[:id])
      unless profile.user == current_user
        render json: {error: "User and hint profile don't match"}, status: 403
        return
      end
      @user_hint_profile = profile
    end

    # Only allow a list of trusted parameters through.
    def user_hint_profile_params
      params.require(:user_hint_profile).permit(:name, :user_id, :default_panel_tracking, :default_panel_display_state_id)
    end
end
