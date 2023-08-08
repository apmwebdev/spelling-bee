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
      get "puzzles/latest", to: "puzzles#latest"
      get "puzzles/:identifier", to: "puzzles#show"
      resources :puzzles, only: [:index]
      resources :user_puzzle_attempts
      resources :guesses
      resources :user_prefs, except: [:index, :destroy]
      # Root
      root "puzzles#latest"
    end
  end

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
