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

require "net/http"
require "uri"
require "json"

# Connects to the OpenAI API to generate word definition hints
class OpenAiApiService
  def initialize
    @logger = ContextualLogger.new("log/open_ai_api.log", "weekly")
    @validator = OpenAiApiValidator.new(@logger)
  end

  def send_request(content, return_json: true)
    method_logger = @logger.with_method(__method__)
    method_logger.info "content = #{content}"
    if content.nil? || content == ""
      method_logger.fatal "No content. Exiting."
      return
    end
    uri = URI.parse("https://api.openai.com/v1/chat/completions")
    request = Net::HTTP::Post.new(uri)
    request.content_type = "application/json"
    request["Authorization"] = "Bearer #{ENV['OPENAI_API_KEY']}"
    request_body = {
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content:,
        },
      ],
    }
    request_body[:response_format] = { type: "json_object" } if return_json
    request.body = JSON.dump(request_body)

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
  end

  def generate_message_content(words_data)
    method_logger = @logger.with_method(__method__)
    unless @validator.valid_answer_list_hash?(words_data)
      method_logger.fatal "'words_data' is invalid. Exiting. words_data: #{words_data}"
      return
    end

    message_opener = "Provide definition hints for the following words:"
    words_string = "#{words_data[:word_set].to_a.join(', ')}\n"
    explanation_parts = []
    explanation_parts.push "Respond in JSON format. There should be an outer object containing an array with the key"
    explanation_parts.push "\"word_hints\". The array should contain an object for each word. The keys in this object"
    explanation_parts.push "should be \"word\", which contains the word itself, and \"hint\", which contains your hint."
    explanation_parts.push "An example of this format would be:"
    explanation_parts.push "{wordHints:[{word:\"aioli\",hint:\"Hint text for 'aioli'\"},{word:\"alit\",hint:\"Hint"
    explanation_parts.push "text for 'alit'\"}]}\n"
    explanation_parts.push "Each hint should be one or two sentences and should not contain any form of the word you're"
    explanation_parts.push "providing a hint for. For example, the hint for \"allay\" should not contain \"allay,\""
    explanation_parts.push "\"allaying,\" \"allays,\" etc. The hints should focus on the meaning of the word,"
    explanation_parts.push "although hints about the pronunciation are also acceptable. These hints are designed to"
    explanation_parts.push "replicate the user-provided hints that users provide on the New York Times Spelling Bee"
    explanation_parts.push "forums for words in that day's Spelling Bee puzzle.\n"
    explanation_parts.push "Please respond only with the JSON object and nothing else."
    "#{message_opener} #{words_string} #{explanation_parts.join(' ')}"
  end

  # Recursively build an answer list (as a Set, later converted to an array) to send to the API for hints
  def generate_answer_list(data = { limit: 200, puzzle_id: 1, last_word: nil, word_set: Set.new })
    method_logger = @logger.with_method(__method__)
    if data[:word_set].size >= data[:limit]
      method_logger.info "Size limit reached. Exiting."
      return data
    end

    # Get all words for the given puzzle ID
    words = Word.joins(:puzzles).where(puzzles: { id: data[:puzzle_id] }).order(:text)
    if words.empty?
      method_logger.error "Words not found for puzzle ID #{data[:puzzle_id]}"
      return data
    end

    # Skip to the word after the last_word, if last_word is not nil
    words = words.drop_while { |word| data[:last_word] && word.text != data[:last_word] }
    # Drop the last_word itself to start with the next word
    words = words.drop(1) unless data[:last_word].nil?
    words.each do |word|
      if data[:word_set].size >= data[:limit]
        method_logger.info "Size limit reached. Exiting."
        return data
      end

      data[:last_word] = word.text
      # Only get hint data for a word once
      unless word.hint.nil?
        method_logger.info "Hint already exists for \"#{word.text}\". Skipping."
        next
      end

      method_logger.info "Adding \"#{word.text}\" to word set."
      data[:word_set].add(word.text)
    end
    data[:puzzle_id] = data[:puzzle_id] + 1
    data[:last_word] = nil
    generate_answer_list(data)
  end

  def parse_response(response)
    method_logger = @logger.with_method(__method__)
    return method_logger.fatal "No response" if response.nil?

    begin
      parsed_body = JSON.parse(response.body, symbolize_names: true)
    rescue JSON::ParserError, TypeError => e
      method_logger.fatal "Body is invalid JSON: #{e.message} Exiting. body = #{body}"
      return
    end

    unless @validator.valid_response_body?(parsed_body)
      method_logger.fatal "Invalid response body"
      return
    end

    content = JSON.parse(parsed_body[:choices][0][:message][:content], symbolize_names: true)
    content[:word_hints]
  end

  def add_hint_to_word(word_hint)
    method_logger = @logger.with_method(__method__)
    unless @validator.valid_word_hint?(word_hint)
      error_message = "Invalid word hint: #{word_hint}"
      method_logger.fatal error_message
      raise StandardError, error_message
    end

    begin
      word = Word.find(word_hint[:word])
    rescue ActiveRecord::RecordNotFound => e
      method_logger.fatal "Can't find word \"#{word_hint[:word]}\""
      raise e
    end

    word.hint = word_hint[:hint]
    word.save!
    method_logger.info "Saved \"#{word.text}\" hint: #{word.hint}"
  end

  # In its own method so it's more easily testable
  def save_hints(word_hints)
    method_logger = @logger.with_method(__method__)
    unless word_hints.is_a?(Array)
      method_logger.fatal "word_hints isn't an array: #{word_hints}"
      return
    end

    method_logger.debug "word_hints length is #{word_hints.length}"
    word_hints.each do |word_hint|
      add_hint_to_word(word_hint)
    end
  end

  def seed_answer_hints
    method_logger = @logger.with_method(__method__)
    # stuff
  end

  def test_connection
    response = send_request("What is OpenAI?", return_json: false)
    puts response.body if response
  end

  def test_hint_seeding
    method_logger = @logger.with_method(__method__)
    words_data = generate_answer_list({ limit: 20, puzzle_id: 1, last_word: nil, word_set: Set.new })
    method_logger.debug words_data

    message_content = generate_message_content(words_data)
    method_logger.debug message_content

    response = send_request(message_content)
    unless response
      method_logger.fatal "No response"
      return
    end
    method_logger.debug "Response body: #{response.body}"

    word_hints = parse_response(response)
    method_logger.debug "Word hints: #{word_hints}"

    save_hints(word_hints)
  end
end
