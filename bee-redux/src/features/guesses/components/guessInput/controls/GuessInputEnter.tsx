/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import React, { useContext } from "react";
import { GuessInputContext } from "@/features/guesses/providers/GuessInputProvider";

export function GuessInputEnter() {
  const { enterPressedEvent } = useContext(GuessInputContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    window.dispatchEvent(enterPressedEvent);
  };

  return (
    <button
      type="button"
      className="GuessInputEnter standardButton"
      onClick={handleClick}
    >
      Enter
    </button>
  );
}
