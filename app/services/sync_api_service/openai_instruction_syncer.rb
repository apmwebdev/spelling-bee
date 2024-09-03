# frozen_string_literal: true

module SyncApiService
  # Sends _and_ receives instructions for OpenAI API
  class OpenaiInstructionSyncer < SyncApiService::Client
    def query_instruction_count
      path = "/instructions/count"
      response = send_get_request(path)
      response[:data]
    end

    def send_instructions
      instruction_count = query_instruction_count
      instructions = OpenaiHintInstruction.offset(instruction_count).each.map(&:to_sync_api)
      return @logger.info "Instructions already fully synced. Exiting" if instructions.empty?

      path = "/instructions/sync"
      response = send_post_request(path, { instructions: })
      raise ApiError, "Error sending instructions: #{response[:error]}" if response[:error]

      @logger.info "Instructions sent successfully: #{response[:success]}"
    rescue StandardError => e
      @logger.exception(e, :fatal)
    end
  end
end
