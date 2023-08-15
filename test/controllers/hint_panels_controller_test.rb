require "test_helper"

class HintPanelsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hint_panel = hint_panels(:one)
  end

  test "should get index" do
    get hint_panels_url, as: :json
    assert_response :success
  end

  test "should create hint_panel" do
    assert_difference("HintPanel.count") do
      post hint_panels_url, params: { hint_panel: { current_display_state_id: @hint_panel.current_display_state_id, hint_profile_id: @hint_panel.hint_profile_id, initial_display_state_id: @hint_panel.initial_display_state_id, name: @hint_panel.name, panel_subtype_id: @hint_panel.panel_subtype_id, panel_subtype_type: @hint_panel.panel_subtype_type, status_tracking_id: @hint_panel.status_tracking_id } }, as: :json
    end

    assert_response :created
  end

  test "should show hint_panel" do
    get hint_panel_url(@hint_panel), as: :json
    assert_response :success
  end

  test "should update hint_panel" do
    patch hint_panel_url(@hint_panel), params: { hint_panel: { current_display_state_id: @hint_panel.current_display_state_id, hint_profile_id: @hint_panel.hint_profile_id, initial_display_state_id: @hint_panel.initial_display_state_id, name: @hint_panel.name, panel_subtype_id: @hint_panel.panel_subtype_id, panel_subtype_type: @hint_panel.panel_subtype_type, status_tracking_id: @hint_panel.status_tracking_id } }, as: :json
    assert_response :success
  end

  test "should destroy hint_panel" do
    assert_difference("HintPanel.count", -1) do
      delete hint_panel_url(@hint_panel), as: :json
    end

    assert_response :no_content
  end
end
