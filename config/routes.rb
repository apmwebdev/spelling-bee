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
      # User preferences
      get "user_prefs", to: "user_prefs#show"
      match "user_prefs", to: "user_prefs#update", via: [:put, :patch]
      match "current_hint_profile",
        to: "user_prefs#set_current_hint_profile",
        via: [:post, :put]
      get "current_hint_profile", to: "user_prefs#get_current_hint_profile"
      # Hints
      resources :user_hint_profiles
      resources :hint_panels, except: [:index, :show]
      # Root
      root "puzzles#latest"
    end
  end

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
