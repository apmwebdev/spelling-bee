class Api::V1::UserDataController < AuthRequiredController
  def user_base_data
    render json: UserDataPresenter.present_user_base_data(current_user)
  end
end
