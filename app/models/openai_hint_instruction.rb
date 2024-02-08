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

##
# The instruction set sent to the OpenAI API for hint generation. Abstracted into its own model for
# easier replication, change tracking, and analysis.
class OpenaiHintInstruction < ApplicationRecord
end

# == Schema Information
#
# Table name: openai_hint_instructions
#
#  id                  :bigint           not null, primary key
#  post_word_list_text :text
#  pre_word_list_text  :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
