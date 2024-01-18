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
  # GET .../puzzle_data/:id
  def recent_puzzles
    return_data = []
    identifier = params[:first_puzzle_identifier].to_s
    current_puzzle = PuzzleIdentifierService.find_puzzle(identifier)
    return_data.push(current_puzzle.to_sync_api)
    current_id = current_puzzle.id
    49.times do
      current_id += 1
      current_puzzle = Puzzle.includes(:answers).find(current_id)
      return_data.push(current_puzzle.to_sync_api)
    rescue ActiveRecord::RecordNotFound
      break
    end
    render json: {
      data: return_data,
      last_id: current_puzzle.id,
    }
  end
end
