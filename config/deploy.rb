# frozen_string_literal: true

# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

require "dotenv"
Dotenv.load(".env.development", ".env.development.local")

# config valid for current version and patch releases of Capistrano
lock "~> 3.18.0"

# Base config
set :application, "ssb"
set :repo_url, "git@github.com:apmwebdev/spelling-bee.git"
set :branch, "main"
set :deploy_to, ENV["DEPLOY_TO"]
set :keep_releases, 5

# Env file config
set :env_file, ".env.development.local"
invoke "dotenv:read"
invoke "dotenv:setup"

# Symlinking
append :linked_files, "config/master.key", ".env.production",
  "config/database.yml", "db/seeds/words_alpha.txt.zip", "bee-redux/env/.env.production.local"
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets",
  "vendor/bundle", ".bundle", "public/system", "public/uploads"

namespace :puma do
  desc "Restart Puma using systemd"
  task :restart do
    on roles(:app) do
      execute :sudo, "systemctl restart puma.service"
    end
  end
end

# After publishing changes, restart Puma
after "deploy:publishing", "puma:restart"
