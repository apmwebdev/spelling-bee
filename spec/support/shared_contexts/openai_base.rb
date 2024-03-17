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

RSpec.shared_context "openai_base" do
  fixtures :openai_hint_instructions
  include_context "contextual_logger_double"

  let(:word_limit) { 20 }
  let(:validator) { OpenaiApiService::Validator.new(logger) }
  let(:service) { OpenaiApiService.new(logger:, validator:, word_limit:) }

  let(:instructions) { openai_hint_instructions(:valid_instructions) }
  let(:ai_model) { OpenaiApiService::Constants::DEFAULT_AI_MODEL }

  let(:sample_words) do
    %w[
      aioli
      alit
      allay
      allot
      alloy
      ally
      alto
      atilt
      atoll
      avail
      iota
      laity
      lava
      loyal
      loyally
      loyalty
      oaty
      oval
      tail
      tali
      tall
      tallit
      tally
      tattoo
      tatty
      total
      totality
      totally
      vial
      villa
      viola
      vital
      vitality
      vitally
      voila
      volatility
    ].freeze
  end
end
