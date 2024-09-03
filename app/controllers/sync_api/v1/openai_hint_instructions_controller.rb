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
  def index
    offset = params[:offset]
    data = OpenaiHintInstruction
      .offset(offset)
      .limit(500)
      .map(&:to_sync_api)
    render json: { data: }
  rescue StandardError => e
    render json: { error: e.message }, status: 400
  end

  def create
    OpenaiHintInstruction.insert_all!(create_params)
    render json: { success: "Sync successful" }
  rescue StandardError => e
    render json: { error: e.message }, status: 422
  end

  def count
    render json: { data: OpenaiHintInstruction.count }
  end

  private

  def create_params
    params.require(:instructions)
      .map do |item|
      item.permit(:id, :pre_word_list_text, :post_word_list_text, :created_at, :updated_at).to_h
    end
  end
end
