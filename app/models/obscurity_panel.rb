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

# :nodoc:
class ObscurityPanel < ApplicationRecord
  include UuidRetryable

  has_one :hint_panel, as: :panel_subtype

  def to_front_end
    {
      panelType: "obscurity",
      uuid:,
      hideKnown: hide_known,
      separateKnown: separate_known,
      revealedLetters: revealed_letters,
      revealLength: reveal_length,
      clickToDefine: click_to_define,
      sortOrder: sort_order,
    }
  end
end

# == Schema Information
#
# Table name: obscurity_panels
#
#  id               :bigint           not null, primary key
#  click_to_define  :boolean          default(FALSE), not null
#  hide_known       :boolean          default(TRUE), not null
#  reveal_length    :boolean          default(TRUE), not null
#  revealed_letters :integer
#  separate_known   :boolean          default(FALSE), not null
#  sort_order       :enum             default("asc"), not null
#  uuid             :uuid             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_obscurity_panels_on_uuid  (uuid) UNIQUE
#
