server "147.182.202.48", user: "deploy", roles: %w{app db web}
set :default_env, {
  RAILS_ENV: 'production',
}
set :ssh_options, {
  keys: %w(/Users/austin/.ssh/do_ssb_deploy)
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

set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{shared_path}/log/puma_access.log"
set :puma_error_log, "#{shared_path}/log/puma_error.log"
set :puma_role, :app
set :puma_env, fetch(:rack_env, fetch(:rails_env, 'production'))

namespace :puma do
  desc 'Start Puma'
  task :start do
    on roles(fetch(:puma_role)) do
      within current_path do
        execute "bundle exec puma -C config/puma.rb -e production"
      end
    end
  end

  desc 'Stop Puma'
  task :stop do
    on roles(fetch(:puma_role)) do
      within current_path do
        execute :bundle, :exec, :puma, 'stop'
      end
    end
  end

  after 'deploy', 'puma:stop'
  after 'deploy', 'puma:start'
end