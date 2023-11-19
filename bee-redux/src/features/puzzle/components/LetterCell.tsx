/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

type LetterCellProps = {
  letter: string;
  isCenter: boolean;
};

export function LetterCell({ letter, isCenter }: LetterCellProps) {
  const handleClick = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: letter }));
  };
  // TODO: Make these fully accessible buttons
  return (
    <svg
      className={isCenter ? "LetterCell centerLetter" : "LetterCell"}
      viewBox="0 0 140 121.2435565"
      onClick={handleClick}
      role="button"
    >
      <polygon
        points="0,60.62177826 35,0 105,0 140,60.62177826 105,121.2435565 35,121.2435565"
        strokeWidth="8.75"
      ></polygon>
      <text x="50%" y="50%" dy="0.35em">
        {letter.toUpperCase()}
      </text>
    </svg>
  );
}
