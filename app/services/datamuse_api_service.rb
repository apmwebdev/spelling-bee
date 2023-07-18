# frozen_string_literal: true
require "open-uri"
require "json"

module DatamuseAPIService
  def self.get_word_data(word)
    return_object = {
      text: word,
      frequency: 0,
      definitions: []
    }
    response = URI.open("https://api.datamuse.com/words?sp=#{word}&qe=sp&md=fd&max=1").read
    json = JSON.parse(response)
    frequency_prop = json[0]["tags"].find do |tag|
      tag[0..1] == "f:"
    end
    return_object[:frequency] = frequency_prop[2..].to_f unless frequency_prop.nil?
    return_object[:definitions] = json[0]["defs"] unless json[0]["defs"].nil?
  end
end
