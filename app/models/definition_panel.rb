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

# A hint panel type for showing a user an answer definition to help them guess the defined word
class DefinitionPanel < ApplicationRecord
  include UuidRetryable

  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "definition",
      uuid:,
      hideKnown: hide_known,
      revealedLetters: revealed_letters,
      separateKnown: separate_known,
      revealLength: reveal_length,
      showObscurity: show_obscurity,
      sortOrder: sort_order,
    }
  end
end

# == Schema Information
#
# Table name: definition_panels
#
#  id               :bigint           not null, primary key
#  hide_known       :boolean          default(TRUE), not null
#  reveal_length    :boolean          default(TRUE), not null
#  show_obscurity   :boolean          default(FALSE), not null
#  sort_order       :enum             default("asc"), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  revealed_letters :integer          default(1), not null
#  separate_known   :boolean          default(TRUE), not null
#  uuid             :uuid             not null
#
# Indexes
#
#  index_definition_panels_on_uuid  (uuid) UNIQUE
#
