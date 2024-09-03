# frozen_string_literal: true

module SyncApiService
  # Syncs just word hints
  class HintSyncer < SyncApiService::Client
    def sync_hints
      @logger.info "Starting hint sync..."
      page = 0
      loop do
        @logger.info "Iterating loop, page: #{page}"
        response = sync_hint_batch(page)

        if response[:data].length < 1000
          @logger.info "Data length < 1000. All hints synced successfully. Exiting"
          break
        end

        page += 1
      end
    rescue StandardError => e
      @logger.exception(e, :fatal)
    end

    private

    def send_get_hints(page)
      path = "/word_hints?page=#{page}"
      @client.send_get_request(path)
    end

    def sync_hint_batch(page)
      @logger.info "Starting hint batch, page: #{page}"
      response = send_get_hints(page)

      @validator.valid_hint_response!(response)

      response[:data].each do |word_hint|
        word = Word.find(word_hint[:word])
        word.hint = word_hint[:hint]
        word.save!
      end
      @logger.info "Batch complete"
      response
    end
  end
end
