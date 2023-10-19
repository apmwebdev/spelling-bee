# config valid for current version and patch releases of Capistrano
lock "~> 3.18.0"

# Base config
set :application, "ssb"
set :repo_url, "git@github.com:apmwebdev/spelling-bee.git"
set :branch, "main"
set :deploy_to, "/home/deploy/#{fetch :application}"
set :keep_releases, 5

# Env file config
set :env_file, ".env.development" # overwritten in production.rb
invoke 'dotenv:read'
invoke 'dotenv:setup'

# Symlinking
append :linked_files, "config/master.key", ".env.production",
  "config/database.yml", "db/seeds/words_alpha.txt.zip"
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets',
  'vendor/bundle', '.bundle', 'public/system', 'public/uploads'

# Tasks

# This is the file to seed the words table in the database. It is very large,
# won't change, and isn't needed after the DB is seeded, so archive it, upload
# it to the server once, and keep it out of git.
desc "Ensure words_alpha.txt.zip exists"
task :ensure_words_alpha_exists do
  on roles(:app) do
    unless File.exist?("#{shared_path}/db/seeds/words_alpha.txt.zip")
      upload! "db/seeds/words_alpha.txt.zip", "#{shared_path}/db/seeds/"
    end
  end
end
before "deploy:check:linked_files", "ensure_words_alpha_exists"
