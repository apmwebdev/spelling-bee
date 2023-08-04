require "test_helper"

class GuessesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @guess = guesses(:one)
  end

  test "should get index" do
    get guesses_url, as: :json
    assert_response :success
  end

  test "should create guess" do
    assert_difference("Guess.count") do
      post guesses_url, params: { guess: { is_spoiled: @guess.is_spoiled, puzzle_id: @guess.puzzle_id, text: @guess.text, user_id: @guess.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show guess" do
    get guess_url(@guess), as: :json
    assert_response :success
  end

  test "should update guess" do
    patch guess_url(@guess), params: { guess: { is_spoiled: @guess.is_spoiled, puzzle_id: @guess.puzzle_id, text: @guess.text, user_id: @guess.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy guess" do
    assert_difference("Guess.count", -1) do
      delete guess_url(@guess), as: :json
    end

    assert_response :no_content
  end
end
