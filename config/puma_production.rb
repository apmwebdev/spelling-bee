# require "puma/daemon"
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

port ENV.fetch("PORT") { 3000 }

environment ENV.fetch("RAILS_ENV") { "production" }

# pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

stdout_redirect '/home/deploy/ssb/shared/log/puma_access.log', '/home/deploy/ssb/shared/log/puma_error.log', true
directory '/home/deploy/ssb/current'
bind "unix:///home/deploy/ssb/shared/tmp/sockets/puma.sock"
pidfile "/home/deploy/ssb/shared/tmp/pids/puma.pid"
state_path "/home/deploy/ssb/shared/tmp/pids/puma.state"
# workers ENV.fetch("WEB_CONCURRENCY") { 2 }
plugin :tmp_restart
# daemonize
