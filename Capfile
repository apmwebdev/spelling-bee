# frozen_string_literal: true

# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

require "capistrano/bundler"
require "capistrano/rails/migrations"
require "capistrano/rbenv"
require "capistrano/dotenv"

set :rbenv_type, :user
set :rbenv_ruby, "3.3.0"

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
