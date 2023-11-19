# Super Spelling Bee - A vocabulary game with integrated hints
# Copyright (C) 2023 Austin Miller
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# See the LICENSE file or https://www.gnu.org/licenses/ for more details.

server ENV["SERVER_IP"], user: ENV["SERVER_USER"], roles: %w[app db web],
  port: ENV["SSH_PORT"]
set :default_env, {
  RAILS_ENV: "production"
}
set :ssh_options, {
  keys: [ENV["SSH_KEY_PATH"]]
}
set :env_file, ".env.production"

# Tasks

# The server doesn't have enough RAM to build the front end, so build it locally
# and upload it instead.
desc "Build the Vite app locally"
task :build_frontend_locally do
  run_locally do
    current_directory = Dir.pwd
    begin
      Dir.chdir("bee-redux")
      execute "npm install"
      execute "npm run build"
    ensure
      Dir.chdir(current_directory)
    end
  end
end
before "deploy:starting", "build_frontend_locally"

desc "Upload Vite build directory"
task :upload_build do
  on roles(:app) do
    upload! "bee-redux/build", "#{release_path}/bee-redux/build",
      recursive: true
  end
end
before "deploy:publishing", "upload_build"
