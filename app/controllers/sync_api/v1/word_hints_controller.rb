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

# TODO: Add docs
class SyncApi::V1::WordHintsController < SyncApi::V1::SyncApiController
  def index
    page = params["page"].to_i
    raise ApiError, "Invalid page" if page.negative? || page > 100

    offset = page * 1000
    data = Word.joins(:puzzles).order(:text).offset(offset).limit(1000).select(:text, :hint)
      .distinct.map { |word| { word: word.text, hint: word.hint } }
    render json: { data:, page: }
  rescue StandardError => e
    puts e.message
    render json: { error: e.message }, status: 400
  end
end
