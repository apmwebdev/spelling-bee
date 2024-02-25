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

# Data for a word hint response sent to the Open AI API. Saved for analytics/auditing.
class OpenaiHintRequest < ApplicationRecord
  belongs_to :openai_hint_instruction
  has_one :openai_hint_response
end

# == Schema Information
#
# Table name: openai_hint_requests
#
#  id                         :bigint           not null, primary key
#  openai_hint_instruction_id :bigint           not null
#  word_list                  :string           is an Array
#  req_ai_model               :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#
# Indexes
#
#  index_openai_hint_requests_on_openai_hint_instruction_id  (openai_hint_instruction_id)
#  index_openai_hint_requests_on_word_list                   (word_list) USING gin
#
# Foreign Keys
#
#  fk_rails_...  (openai_hint_instruction_id => openai_hint_instructions.id)
#
