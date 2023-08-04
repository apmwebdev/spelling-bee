require "test_helper"

class UserPuzzleAttemptsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_puzzle_attempt = user_puzzle_attempts(:one)
  end

  test "should get index" do
    get user_puzzle_attempts_url, as: :json
    assert_response :success
  end

  test "should create user_puzzle_attempt" do
    assert_difference("UserPuzzleAttempt.count") do
      post user_puzzle_attempts_url, params: { user_puzzle_attempt: { puzzle_id: @user_puzzle_attempt.puzzle_id, user_id: @user_puzzle_attempt.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show user_puzzle_attempt" do
    get user_puzzle_attempt_url(@user_puzzle_attempt), as: :json
    assert_response :success
  end

  test "should update user_puzzle_attempt" do
    patch user_puzzle_attempt_url(@user_puzzle_attempt), params: { user_puzzle_attempt: { puzzle_id: @user_puzzle_attempt.puzzle_id, user_id: @user_puzzle_attempt.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy user_puzzle_attempt" do
    assert_difference("UserPuzzleAttempt.count", -1) do
      delete user_puzzle_attempt_url(@user_puzzle_attempt), as: :json
    end

    assert_response :no_content
  end
end
