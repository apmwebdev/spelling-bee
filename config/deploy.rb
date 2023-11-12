# config valid for current version and patch releases of Capistrano
lock "~> 3.18.0"

# Base config
set :application, "ssb"
set :repo_url, "git@github.com:apmwebdev/spelling-bee.git"
set :branch, "main"
set :deploy_to, ENV["DEPLOY_TO"]
set :keep_releases, 5

# Env file config
set :env_file, ".env.development" # overwritten in production.rb
invoke "dotenv:read"
invoke "dotenv:setup"

# Symlinking
append :linked_files, "config/master.key", ".env.production",
  "config/database.yml", "db/seeds/words_alpha.txt.zip", "bee-redux/env/.env.production.local"
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets",
  "vendor/bundle", ".bundle", "public/system", "public/uploads"
