# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

Rails.application.routes.draw do
  devise_for :users, path: "api/v1/auth",
    path_names: {
      sign_in: "login",
      sign_out: "logout",
      registration: "signup"
    },
    controllers: {
      sessions: "api/v1/users/sessions",
      registrations: "api/v1/users/registrations",
      passwords: "api/v1/users/passwords",
      confirmations: "api/v1/users/confirmations",
      unlocks: "api/v1/users/unlocks"
    }
  namespace :api do
    namespace :v1 do
      # Auth
      devise_scope :user do
        post "auth/confirmation/resend", to: "users/confirmations#resend"
        get "auth/check", to: "users/sessions#check_auth"
      end
      # Puzzles
      get "puzzles/latest", to: "puzzles#latest"
      get "puzzles/:identifier", to: "puzzles#show"
      resources :puzzles, only: [:index]
      # Attempts and guesses
      get "puzzle_user_puzzle_attempts/:puzzle_id",
        to: "user_puzzle_attempts#index_for_puzzle"
      resources :user_puzzle_attempts, param: :uuid, except: :update
      get "user_puzzle_attempt_guesses/:user_puzzle_attempt_uuid",
        to: "guesses#index_for_attempt"
      resources :guesses, param: :uuid, only: :create
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
      resources :hint_panels, param: :uuid, except: [:index, :show] do
        put "move", on: :collection
      end
      # Search panel searches
      get "search_panel_search/:attempt_uuid",
        to: "search_panel_searches#for_attempt_and_profile"
      resources :search_panel_searches, param: :uuid, only: [:create, :update, :destroy]
      # Root
      root "puzzles#latest"
    end
  end

  # Defines the root path route ("/")
  root "api/v1/puzzles#latest"
end
