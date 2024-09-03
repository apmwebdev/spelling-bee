# frozen_string_literal: true

module SyncApiService
  # Syncs puzzles and associated answers and words
  class PuzzleSyncer < SyncApiService::Client
    def sync_puzzles(starting_id = nil, page_size: 50, page_limit: nil)
      starting_id ||= Puzzle.last.id
      @logger.info "Starting with #{starting_id}"
      page_count = 0

      loop do
        @logger.info "Iterating loop"
        response = sync_puzzle_batch(starting_id, page_size:)
        raise ApiError, "Error returned: #{response[:error]}" if response[:error]

        page_count += 1
        if page_limit.is_a?(Integer) && page_count >= page_limit
          @logger.info "Page limit reached. Exiting"
          break
        end

        if response[:data].length < page_size
          @logger.info "Data length < #{page_size}. Last puzzle reached. Exiting"
          break
        end

        starting_id = result[:last_id].to_i + 1
      end
    rescue StandardError => e
      @logger.exception(e, :fatal)
    end

    # The puzzle data for the Sync API is paginated, so this method is for getting one page of data
    # at a time, which is 50 puzzles. This method is called in a loop by the `sync_recent_puzzles`
    # method until it gets to the most recent puzzle.
    def sync_puzzle_batch(starting_id, page_size:)
      @logger.info "Starting with #{starting_id}"
      path = "/recent_puzzles/#{starting_id}?limit=#{page_size}"
      response = send_get_request(path)

      @validator.valid_puzzle_response!(response)

      @logger.info "Begin loop through data array"
      response[:data].each do |item|
        puzzle_data = item[:puzzle_data]
        puzzle_id = puzzle_data[:id].to_i
        @logger.info "Syncing puzzle #{puzzle_id}"
        existing_puzzle = Puzzle.find_by(id: puzzle_id)
        if existing_puzzle && Date.parse(puzzle_data[:date]) == existing_puzzle.date
          @logger.info "Data for puzzle #{puzzle_id} already matches. Skipping."
          next
        end

        update_or_create_puzzle(item, existing_puzzle)
      end
      response
    end

    def update_or_create_puzzle(data_hash, existing_puzzle)
      puzzle_data, origin_data, answer_words =
        data_hash.values_at(:puzzle_data, :origin_data, :answer_words)

      update_or_create_origin(puzzle_data, origin_data)

      if existing_puzzle.nil?
        puzzle = Puzzle.create!(puzzle_data)
      else
        puzzle = existing_puzzle
        puzzle.update!(puzzle_data)
        puzzle.answers.destroy_all
        puzzle.user_puzzle_attempts.destroy_all
      end

      create_answers(puzzle, answer_words)
    end

    def update_or_create_origin(puzzle_data, origin_data)
      if puzzle_data[:origin_type] == "NytPuzzle"
        existing_origin = NytPuzzle.find_by(id: origin_data[:id].to_i)
        return NytPuzzle.create!(origin_data) unless existing_origin

        existing_origin.update!(origin_data)
      elsif puzzle_data[:origin_type] == "SbSolverPuzzle"
        existing_origin = SbSolverPuzzle.find_by(id: origin_data[:id].to_i)
        return SbSolverPuzzle.create!(origin_data) unless existing_origin

        existing_origin.update!(origin_data)
      else
        raise ApiError, "Invalid origin type: #{puzzle_data[:origin_type]}"
      end
    end

    def create_answers(puzzle, answer_words)
      answer_words.each do |word_data|
        text = word_data[:text]
        word = Word.create_or_find_by!(text:)
        word.update!(word_data.except(:text))
        Answer.create!({ puzzle:, word_text: text })
      end
    end
  end
end
