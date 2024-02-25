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

# A hint panel type for searching for a substring within each answer
class SearchPanel < ApplicationRecord
  include UuidRetryable

  has_one :hint_panel, as: :panel_subtype
  has_one :hint_profile, through: :hint_panel
  has_many :search_panel_searches, dependent: :destroy

  def to_front_end
    {
      panelType: "search",
      uuid:,
      location:,
      outputType: output_type,
      lettersOffset: letters_offset,
    }
  end
end

# == Schema Information
#
# Table name: search_panels
#
#  id             :bigint           not null, primary key
#  location       :enum             default("anywhere"), not null
#  output_type    :enum             default("letters_list"), not null
#  letters_offset :integer          default(0), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  uuid           :uuid             not null
#
# Indexes
#
#  index_search_panels_on_uuid  (uuid) UNIQUE
#
