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

RSpec.shared_context "openai_puzzle_words" do
  let(:first_puzzle_words) do
    %w[arrow arrowroot athwart away awry harrow thataway thaw throw throwaway thwart wahoo wart
      warty wary watt what whoa woot worry worrywart wort worth worthy wrath yarrow]
  end

  let(:second_puzzle_words) do
    %w[cirri coffin coif coin comic confirm conic coniform croci firm foci formic icon iconic
      infirm info inform ionic iron ironic micro microform micron miff mimic mini minim minion
      minor mirror moronic noir omicron onion ricin riff]
  end

  let(:third_puzzle_words) do
    %w[cell celli chef chic chichi chicle chicly chief chiefly chili chill chilly clef cliche cliff
      cycle cyclic fiche filch fleece icicle icily lech leech lice lychee yecch yech]
  end
end
