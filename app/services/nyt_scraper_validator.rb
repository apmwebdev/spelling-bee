# frozen_string_literal: true

class NytScraperValidator
  def initialize(logger, json_data)
    @logger = logger
    @json_data = json_data
  end

  def err_log(to_log)
    err_msg = "Invalid JSON:"
    @logger.error "#{err_msg} #{to_log}\n"
  end

  def valid?
    unless @json_data.is_a?(Hash)
      err_log "JSON data is not a hash."
      return false
    end

    unless structure_matches?(@json_data)
      err_log "Invalid JSON structure."
      return false
    end

    unless today_valid?
      err_log "Invalid format for 'today'."
      return false
    end

    unless valid_puzzles?(@json_data["pastPuzzles"]["thisWeek"])
      err_log "Invalid format for 'thisWeek'."
      return false
    end

    unless valid_puzzles?(@json_data["pastPuzzles"]["lastWeek"])
      err_log "Invalid format for 'lastWeek'."
      return false
    end

    true
  end

  def structure_matches?(data)
    unless data.is_a?(Hash)
      err_log "Structure doesn't match. Data is not a hash."
      return false
    end
    return false unless data.key?("today") && data["today"].is_a?(Hash)
    return false unless data.key?("pastPuzzles") && data["pastPuzzles"].is_a?(Hash)
    return false unless data["pastPuzzles"].key?("thisWeek") && data["pastPuzzles"]["thisWeek"].is_a?(Array)
    return false unless data["pastPuzzles"].key?("lastWeek") && data["pastPuzzles"]["lastWeek"].is_a?(Array)

    true
  end

  def today_valid?
    valid_puzzle?(@json_data["today"])
  end

  def bad_puzzle(to_log, puzzle_data)
    err_log "Invalid puzzle for #{puzzle_data["printDate"]}: #{to_log}"
  end

  def valid_puzzle?(puzzle_data)
    unless puzzle_data.is_a?(Hash)
      bad_puzzle("Puzzle is not a hash.", puzzle_data)
      return false
    end
    unless puzzle_data.key?("displayDate") && valid_date?(puzzle_data["displayDate"])
      bad_puzzle("Invalid displayDate.", puzzle_data)
      return false
    end
    unless puzzle_data.key?("centerLetter") && valid_letter?(puzzle_data["centerLetter"])
      bad_puzzle("Invalid center letter.", puzzle_data)
      return false
    end
    unless puzzle_data.key?("outerLetters") && valid_outer_letters_array?(puzzle_data["outerLetters"])
      bad_puzzle("Invalid outer letters.", puzzle_data)
      return false
    end
    unless puzzle_data.key?("answers") && valid_answers?(puzzle_data["answers"])
      bad_puzzle("Invalid answers.", puzzle_data)
      return false
    end

    true
  end

  def valid_puzzles?(puzzles)
    return false unless puzzles.is_a?(Array)
    puzzles.all? { |puzzle| valid_puzzle?(puzzle) }
  end

  def valid_date?(date_string)
    Date.parse(date_string)
    true
  rescue ArgumentError => e
    @logger.error "Invalid date format: #{date_string}. Error: #{e.message}"
    false
  end

  def valid_letter?(letter)
    letter.match?(/\A[a-zA-Z]\z/)
  end

  # Outer letters must be an array of exactly 6 letters
  def valid_outer_letters_array?(letters)
    return false unless letters.is_a?(Array)
    return false unless letters.length == 6
    letters.all? { |letter| valid_letter?(letter) }
  end

  def valid_answers?(answers)
    return false unless answers.is_a?(Array)
    answers.all? { |answer| answer.is_a?(String) }
  end
end
