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
class SyncApi::V1::OpenaiLogsController < SyncApi::V1::SyncApiController
  def index_with_offset
    requests_offset = params["requests_offset"].to_i
    responses_offset = params["responses_offset"].to_i
    requests = OpenaiHintRequest.order(:id).offset(requests_offset).limit(100).map(&:to_sync_api)
    responses = OpenaiHintResponse.order(:id).offset(responses_offset).limit(100).map(&:to_sync_api)
    render json: { data: { requests:, responses: }}
  rescue StandardError => e
    render json: { error: e.message }, status: 400
  end
end
