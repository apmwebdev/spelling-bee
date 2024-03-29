# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.3.0"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.3"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.5"

gem "bcrypt_pbkdf", "~> 1.0"
gem "capistrano", "~> 3.18"
gem "capistrano-dotenv"
gem "capistrano-rails", "~> 1.6"
gem "capistrano-rbenv", "~> 2.2"
gem "devise"
gem "devise-jwt"
gem "devise-jwt-cookie", git: "https://github.com/apmwebdev/devise-jwt-cookie", ref: "acc4cc9"
gem "dotenv", "~> 2.8"
gem "dotenv-rails", "~> 2.8"
gem "ed25519", "~> 1.2"
gem "jsonapi-serializer"
gem "logger"
gem "nokogiri", "~> 1.16.2"
gem "puma", "~> 5.0"
gem "rack-cors"
gem "rubocop", "~> 1.56", require: false
gem "rubocop-rails", "~> 2.23", require: false
gem "sentry-rails"
gem "sentry-ruby"
gem "yard", "~> 0.9"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# gem "jbuilder"

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem "rack-cors"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[mri mingw x64_mingw]
  # The RSpec docs recommend adding it to the dev env as well as test so that you don't need to
  # specify the environment when running generators and rake tasks
  gem "rspec-rails", "~> 6.1"
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
  gem "annotate", "~> 3.2"
  gem "letter_opener"
end

group :test do
  gem "database_cleaner-active_record"
  gem "vcr", "~> 6.2"
  gem "webmock", "~> 3.20"
end
