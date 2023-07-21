class Puzzle < ApplicationRecord
  belongs_to :origin, polymorphic: true
  has_many :answers
  has_many :words, through: :answers

  attr_accessor :pangrams, :perfect_pangrams, :valid_letters

  def set_valid_letters
    @valid_letters ||= [self.center_letter, *self.outer_letters].sort
  end

  def set_pangrams
    @pangrams ||= []
    return unless @pangrams.empty?
    set_valid_letters
    potential_pangrams = Answer.where(puzzle_id: self.id).where("length(word_text) >= 7")
    potential_pangrams.each do |pan|
      @pangrams.push(pan.word_text) if Set.new(pan.word_text.split("")).length == 7
    end
    @pangrams
  end

  def set_perfect_pangrams
    @perfect_pangrams ||= []
    return unless @perfect_pangrams.empty?
    set_pangrams
    @perfect_pangrams = []
    @pangrams.each do |pan_word|
      @perfect_pangrams.push(pan_word) if pan_word.length == 7
    end
    @perfect_pangrams
  end

  def set_derived_fields
    set_valid_letters
    set_pangrams
    set_perfect_pangrams
  end

  def to_front_end
    set_derived_fields
    {
      id: self.id,
      date: self.date,
      centerLetter: self.center_letter,
      outerLetters: self.outer_letters,
      validLetters: @valid_letters,
      pangrams: @pangrams,
      perfectPangrams: @perfect_pangrams,
      answers: self.answers.map do |answer|
        answer.to_front_end
      end.sort{ |a, b| a[:word] <=> b[:word]},
    }
  end
end
