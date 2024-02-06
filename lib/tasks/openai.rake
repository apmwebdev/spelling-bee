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

namespace :openai do
  desc "Run #test_connection"
  task test_connection: :environment do
    OpenaiApiService.new.test_connection
  end

  desc "Run #test_request"
  # e.g. rake "openai:test_request[20]"
  task :test_request, [:word_limit] => :environment do |_t, args|
    OpenaiApiService.new.test_request_and_save(args[:word_limit])
  end

  desc "Run #test_request_and_save"
  # e.g. rake "openai:test_request_and_save[20]"
  task :test_request_and_save, [:word_limit] => :environment do |_t, args|
    OpenaiApiService.new.test_request_and_save(args[:word_limit])
  end

  desc "Run #test_batching"
  # e.g. rake "openai:test_batching[20, 2]"
  task :test_batching, [:word_limit, :batch_limit] => :environment do |_t, args|
    OpenaiApiService.new.test_batching(args[:word_limit], args[:batch_limit])
  end
end
