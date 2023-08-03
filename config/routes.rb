Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :words
      get "puzzles/latest", to: "puzzles#latest"
      get "puzzles/:identifier", to: "puzzles#show"
      resources :puzzles, only: [:index]
      root "puzzles#latest"
      devise_for :users, path: "", path_names: {
        sign_in: "login",
        sign_out: "logout",
        registration: "signup",
      },
        controllers: {
          sessions: "api/v1/users/sessions",
          registrations: "api/v1/users/registrations",
        }
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
