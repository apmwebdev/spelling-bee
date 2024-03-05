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
require "json"

# Retrieves definition and frequency data for a word
module DatamuseApiService
  def self.get_word_data(word)
    return_object = {
      text: word,
      frequency: 0,
      definitions: [],
    }
    response = URI.open("https://api.datamuse.com/words?sp=#{word}&qe=sp&md=fd&max=1").read
    json = JSON.parse(response, symbolize_names: true) if response
    frequency_prop = json[0][:tags].find do |tag|
      tag[0..1] == "f:"
    end
    return_object[:frequency] = frequency_prop[2..].to_f unless frequency_prop.nil?
    return_object[:definitions] = json[0][:defs] unless json[0][:defs].nil?
    return_object
  end
end
