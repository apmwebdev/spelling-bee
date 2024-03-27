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

# Controller for sending puzzle data for the Sync API (API for syncing data between
# different instances of the app). This controller is used by the instance acting
# as the host, receiving the request.
class SyncApi::V1::PuzzleDataController < SyncApi::V1::SyncApiController
  # GET .../puzzle_data/:starting_id?limit=:limit
  def recent_puzzles
    return_data = []
    limit = params[:limit].to_i
    puzzle_id = params[:starting_id].to_i
    if limit < 1 || puzzle_id < 1
      render json: { error: "Invalid params" }, status: 400
      return
    end

    limit.times do
      current_puzzle = Puzzle.includes(:words).find(puzzle_id)
      return_data.push(current_puzzle.to_sync_api)
      puzzle_id += 1
    rescue ActiveRecord::RecordNotFound
      break
    end

    render json: {
      data: return_data,
      last_id: puzzle_id,
    }
  end
end
