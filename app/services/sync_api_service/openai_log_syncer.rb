# frozen_string_literal: true

module SyncApiService
  # Syncs logs of requests to the OpenAI API
  class OpenaiLogSyncer < SyncApiService::Syncer
    def sync_openai_logs
      @logger.info "Starting OpenAI API request and response sync..."
      loop do
        result = sync_openai_log_batch
        if result[:requests_count] < 100 && result[:responses_count] < 100
          @logger.info "All records synced. Exiting"
          break
        end
      end
    rescue StandardError => e
      @logger.exception e, :fatal
    end

    private

    def send_get_openai_logs(requests_offset, responses_offset)
      path = "/openai_logs?requests_offset=#{requests_offset}&responses_offset=#{responses_offset}"
      @client.send_get_request(path)
    end

    def sync_openai_log_batch
      requests_offset = OpenaiHintRequest.count
      responses_offset = OpenaiHintResponse.count
      @logger.info "Starting batch. Page size: 100 each, requests_offset: #{requests_offset}, "\
        "responses_offset: #{responses_offset}"
      result = send_get_openai_logs(requests_offset, responses_offset)[:data]
      OpenaiHintRequest.insert_all!(result[:requests])
      OpenaiHintResponse.insert_all!(result[:responses])
      requests_count = result[:requests].length
      responses_count = result[:responses].length
      @logger.info "Batch complete. requests_count: #{requests_count}, responses_count: "\
        "#{responses_count}"
      { requests_count:, responses_count: }
    end
  end
end
