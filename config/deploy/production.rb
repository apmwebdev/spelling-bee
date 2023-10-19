server "147.182.202.48", user: "deploy", roles: %w{app db web}
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
