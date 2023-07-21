Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :words
      get "puzzles/latest", to: "puzzles#latest"
      get "puzzles/:identifier", to: "puzzles#show"
      resources :puzzles, only: [:index]
      root "puzzles#latest"
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
