require "test_helper"

class HintProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hint_profile = hint_profiles(:one)
  end

  test "should get index" do
    get hint_profiles_url, as: :json
    assert_response :success
  end

  test "should create hint_profile" do
    assert_difference("HintProfile.count") do
      post hint_profiles_url, params: { hint_profile: { default_panel_display_state_id: @hint_profile.default_panel_display_state_id, default_panel_tracking_id: @hint_profile.default_panel_tracking_id, name: @hint_profile.name, user_id: @hint_profile.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show hint_profile" do
    get hint_profile_url(@hint_profile), as: :json
    assert_response :success
  end

  test "should update hint_profile" do
    patch hint_profile_url(@hint_profile), params: { hint_profile: { default_panel_display_state_id: @hint_profile.default_panel_display_state_id, default_panel_tracking_id: @hint_profile.default_panel_tracking_id, name: @hint_profile.name, user_id: @hint_profile.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy hint_profile" do
    assert_difference("HintProfile.count", -1) do
      delete hint_profile_url(@hint_profile), as: :json
    end

    assert_response :no_content
  end
end
