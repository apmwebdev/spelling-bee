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

# A hint panel type for showing hints based on certain substrings within answers,
# such as the first letter or first two letters.
class LetterPanel < ApplicationRecord
  include UuidRetryable

  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "letter",
      uuid:,
      location:,
      outputType: output_type,
      numberOfLetters: number_of_letters,
      lettersOffset: letters_offset,
      hideKnown: hide_known,
    }
  end
end

# == Schema Information
#
# Table name: letter_panels
#
#  id                :bigint           not null, primary key
#  hide_known        :boolean          default(TRUE), not null
#  letters_offset    :integer          default(0), not null
#  location          :enum             default("start"), not null
#  number_of_letters :integer          default(1), not null
#  output_type       :enum             default("letters_list"), not null
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_letter_panels_on_uuid  (uuid) UNIQUE
#
