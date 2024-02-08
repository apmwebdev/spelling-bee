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

# A search result for a search hint panel
class SearchPanelSearch < ApplicationRecord
  include UuidRetryable
  include TimeConverter

  belongs_to :search_panel
  belongs_to :user_puzzle_attempt

  def to_front_end
    {
      uuid:,
      searchPanelUuid: search_panel_uuid,
      attemptUuid: user_puzzle_attempt_uuid,
      searchString: search_string,
      location:,
      lettersOffset: letters_offset,
      outputType: output_type,
      createdAt: jsify_timestamp(created_at),
    }
  end
end

# == Schema Information
#
# Table name: search_panel_searches
#
#  id                       :bigint           not null, primary key
#  letters_offset           :integer
#  location                 :enum             default("anywhere"), not null
#  output_type              :enum             default("letters_list"), not null
#  search_panel_uuid        :uuid
#  search_string            :string
#  user_puzzle_attempt_uuid :uuid
#  uuid                     :uuid             not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  search_panel_id          :bigint           not null
#  user_puzzle_attempt_id   :bigint           not null
#
# Indexes
#
#  index_search_panel_searches_on_search_panel_id           (search_panel_id)
#  index_search_panel_searches_on_search_panel_uuid         (search_panel_uuid)
#  index_search_panel_searches_on_user_puzzle_attempt_id    (user_puzzle_attempt_id)
#  index_search_panel_searches_on_user_puzzle_attempt_uuid  (user_puzzle_attempt_uuid)
#  index_search_panel_searches_on_uuid                      (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (search_panel_id => search_panels.id)
#  fk_rails_...  (search_panel_uuid => search_panels.uuid)
#  fk_rails_...  (user_puzzle_attempt_id => user_puzzle_attempts.id)
#  fk_rails_...  (user_puzzle_attempt_uuid => user_puzzle_attempts.uuid)
#
