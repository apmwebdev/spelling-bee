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

require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module SpellingBee
  # :nodoc:
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
    config.active_record.schema_format = :sql
    config.middleware.use ActionDispatch::Cookies
    config.autoload_paths << "#{root}/db/seeds"
    config.autoload_paths << "#{root}/lib"
  end
end
