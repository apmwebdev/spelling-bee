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

# The fixture
module NytScraperHelper
  extend self

  FILE_PATH = Rails.root.join("spec", "fixtures", "extracted_nyt_json.json")

  def save_data(response_json)
    File.open(FILE_PATH, "w") do |file|
      file.write(JSON.pretty_generate(response_json))
    end
    puts "Response JSON persisted successfully."
  end

  def maybe_save_data(response_json)
    return if File.exist?(FILE_PATH)
    save_data(response_json)
  end

  def load_data
    file_content = File.read(FILE_PATH)
    JSON.parse(file_content, symbolize_names: true)
  end
end
