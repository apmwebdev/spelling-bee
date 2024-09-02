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

# Seed the words table of the database. Note that this will attempt to seed all
# ~600,000 words. Do not do this unless you REALLY want to do this.
module WordSeeder
  def self.seed_from_file
    File.foreach("db/seeds/words_alpha.txt") do |line|
      Word.create({ text: line.strip })
    end
  end

  def self.test_seed
    first_ten = File.foreach("db/seeds/words_alpha.txt").first(10)
    first_ten.each do |word|
      Word.create({ text: word.strip })
    end
  end
end
