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

# TODO: Add doc
class SyncApi::V1::OpenaiHintInstructionsController < SyncApi::V1::SyncApiController
  def count
    render json: { data: OpenaiHintInstruction.count }
  end

  def sync
    OpenaiHintInstruction.insert_all!(sync_params)
    render json: { success: "Sync successful" }
  rescue StandardError => e
    render json: { error: e.message }, status: 422
  end

  private

  def sync_params
    params.require(:instructions)
      .map do |item|
      item.permit(:id, :pre_word_list_test, :post_word_list_text, :created_at, :updated_at).to_h
    end
  end
end
