Rails.application.routes.draw do
  devise_for :users, path: "api/v1", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup",
  },
    controllers: {
      sessions: "api/v1/users/sessions",
      registrations: "api/v1/users/registrations",
    }
  namespace :api do
    namespace :v1 do
      resources :words
      # Puzzles
      get "puzzles/latest", to: "puzzles#latest"
      get "puzzles/:identifier", to: "puzzles#show"
      resources :puzzles, only: [:index]
      # Attempts and guesses
      get "/user_puzzle_attempts_for_puzzle/:puzzle_id",
        to: "user_puzzle_attempts#index_for_puzzle"
      resources :user_puzzle_attempts, except: [:update]
      resources :guesses, only: :create
      # General user data
      get "user_base_data", to: "user_data#user_base_data"
      get "user_puzzle_data/:puzzle_id", to: "user_data#user_puzzle_data"
      # User preferences
      get "user_prefs", to: "user_prefs#show"
      match "user_prefs", to: "user_prefs#update", via: [:put, :patch]
      match "current_hint_profile",
        to: "user_prefs#set_current_hint_profile",
        via: [:post, :put]
      get "current_hint_profile", to: "user_prefs#get_current_hint_profile"
      # Hints
      get "hint_profiles", to: "user_hint_profiles#get_all_hint_profiles"
      resources :user_hint_profiles
      resources :hint_panels, except: [:index, :show]
      # Search panel searches
      get "search_panel_search/:attempt_id",
        to: "search_panel_searches#for_attempt_and_profile"
      # Root
      root "puzzles#latest"
    end
  end

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
