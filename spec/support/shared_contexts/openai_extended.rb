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

# require "rails_helper"

RSpec.shared_context "openai_extended" do
  include_context "openai_base"

  let(:empty_word_list) { OpenaiApiService::WordList.new }
  let(:full_word_list) do
    service.generate_word_data(OpenaiApiService::WordList.new(1, sample_words.take(word_limit)))
  end
  let(:message_content) { service.generate_message_content(full_word_list, instructions) }
  let(:request_record) { service.save_hint_request(full_word_list, instructions, ai_model) }
  let(:wrapped_response) do
    VCR.use_cassette("hint_request_20") do
      service.send_request(message_content, ai_model:)
    end
  end
  let(:parsed_response) do
    OpenaiApiService::ParsedResponse.new(logger, validator, wrapped_response)
  end
end
