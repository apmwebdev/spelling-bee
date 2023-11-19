/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import React from "react";
import { LetterCell } from "./LetterCell";
import { useAppSelector } from "@/app/hooks";
import {
  selectCenterLetter,
  selectShuffledOuterLetters,
} from "@/features/puzzle";
import uniqid from "uniqid";

export function Hive() {
  const centerLetter = useAppSelector(selectCenterLetter);
  const outerLetters = useAppSelector(selectShuffledOuterLetters);
  return (
    <div className="HiveContainer">
      <div className="Hive">
        <LetterCell letter={centerLetter} isCenter={true} />
        {outerLetters.map((letter) => {
          return <LetterCell key={uniqid()} letter={letter} isCenter={false} />;
        })}
      </div>
    </div>
  );
}
