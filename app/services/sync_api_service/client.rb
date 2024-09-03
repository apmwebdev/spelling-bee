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

require "open-uri"
require "net/http"
require "uri"

# This is the service that is the client half of the Sync API. It is designed to be used by a dev
# environment to get the most up-to-date puzzle data from the production environment.
class SyncApiService::Client
  include BasicValidator

  BASE_URL = ENV["PRODUCTION_SYNC_API_URL"]
  AUTH_TOKEN = "Bearer #{ENV['PRODUCTION_SYNC_API_KEY']}".freeze

  attr_reader :logger, :validator

  def initialize(logger: nil, validator: nil)
    self.logger = logger
    self.validator = validator
  end

  def send_get_request(path)
    full_url = "#{BASE_URL}#{path}"
    response = URI.open(full_url, "Authorization" => AUTH_TOKEN)&.read
    raise TypeError, "Response is nil. Exiting." unless response

    response = JSON.parse(response, symbolize_names: true)
    raise ApiError, "Error: #{response[:error]}" if response[:error]
    response
  end

  def send_post_request(path, body)
    full_url = "#{BASE_URL}#{path}"
    uri = URI.parse(full_url)
    http = Net::HTTP.new(uri.host || "", uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request.content_type = "application/json"
    request["Authorization"] = AUTH_TOKEN
    request.body = JSON.dump(body)

    response = http.request(request)

    JSON.parse(response.body, symbolize_names: true)
  end

  def logger=(value)
    @logger =
      if value.is_a?(ContextualLogger)
        value
      else
        ContextualLogger.new("log/sync_api.log", "weekly",
          global_puts_and: [:unknown, :fatal, :error, :warn, :info],)
      end
    @validator&.logger = value
  end

  def validator=(value)
    @validator =
      if value.is_a?(Validator)
        value
      else
        Validator.new(@logger)
      end
  end
end
