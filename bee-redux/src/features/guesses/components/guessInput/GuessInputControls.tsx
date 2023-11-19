/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { GuessInputBackspace } from "./controls/GuessInputBackspace";
import { GuessInputEnter } from "./controls/GuessInputEnter";
import { ShuffleButton } from "@/features/guesses/components/guessInput/controls/ShuffleButton";

export function GuessInputControls() {
  return (
    <div className="GuessInputControls">
      <GuessInputBackspace />
      <ShuffleButton />
      <GuessInputEnter />
    </div>
  );
}
