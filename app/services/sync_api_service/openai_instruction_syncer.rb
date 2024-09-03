# frozen_string_literal: true

module SyncApiService
  # Sends _and_ receives instructions for OpenAI API
  class OpenaiInstructionSyncer < SyncApiService::Syncer
    def post_instructions
      instruction_count = send_get_instruction_count[:data]
      instructions = OpenaiHintInstruction.offset(instruction_count).each.map(&:to_sync_api)
      return @logger.info "Instructions already fully synced. Exiting" if instructions.empty?

      response = send_post_instructions(instructions)
      raise ApiError, "Error sending instructions: #{response[:error]}" if response[:error]

      @logger.info "Instructions sent successfully: #{response[:success]}"
    rescue StandardError => e
      @logger.exception(e, :fatal)
    end

    def sync_instructions(offset = 0)
      @logger.info "Beginning sync for OpenaiApiInstructions"
      response = send_get_instructions(offset)
      if response[:error]
        raise ApiError, "Error fetching OpenaiApiHintInstructions: #{response[:error]}"
      end

      data = response[:data]
      @logger.info "Response data length: #{data.length}"
      data.each do |instruction|
        OpenaiHintInstruction.create!(instruction)
      end
      @logger.info "Sync completed successfully"
    rescue StandardError => e
      @logger.exception(e, :fatal)
    end

    private

    def send_get_instruction_count
      path = "/openai_hint_instructions/count"
      @client.send_get_request(path)
    end

    def send_get_instructions(offset)
      path = "/openai_hint_instructions?offset=#{offset}"
      @client.send_get_request(path)
    end

    def send_post_instructions(instructions)
      path = "/openai_hint_instructions"
      @client.send_post_request(path, { instructions: })
    end
  end
end
