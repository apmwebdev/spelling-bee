# frozen_string_literal: true

module WordsSeederService
  def self.seed_from_file
    File.foreach("db/seeds/words_alpha.txt") do |line|
      Word.create({text: line.strip})
    end
  end

  def self.test_seed
    first_ten = File.foreach("db/seeds/words_alpha.txt").first(10)
    first_ten.each do |word|
      Word.create({text: word.strip})
    end
  end
end
