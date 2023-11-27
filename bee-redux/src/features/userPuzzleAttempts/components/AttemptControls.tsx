/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AttemptSelector } from "./AttemptSelector";
import { NewAttemptButton } from "./NewAttemptButton";
import { DeleteAttemptButton } from "./DeleteAttemptButton";

export function AttemptControls() {
  return (
    <div className="AttemptControls">
      <span>Attempt:</span>
      <AttemptSelector />
      <div className="IconButton-group group-2">
        <NewAttemptButton />
        <DeleteAttemptButton />
      </div>
    </div>
  );
}
