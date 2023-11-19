/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { BlankRank, Rank, useCurrentPuzzle } from "@/features/puzzle";
import { selectScore } from "@/features/guesses";
import { ProgressBar } from "./ProgressBar";
import { FoundWordsStatus } from "@/features/wordLists/components/foundWords/FoundWordsStatus";

export function Progress() {
  const puzzleQ = useCurrentPuzzle();
  const ranks = puzzleQ.data?.ranks ?? [BlankRank];
  const score = useAppSelector(selectScore);
  const totalPoints = puzzleQ.data?.totalPoints ?? 0;

  const currentRank = (): Rank => {
    if (!puzzleQ.isSuccess || score > totalPoints) {
      return ranks[0];
    }
    let returnRank = ranks[0];
    for (const [i, rank] of ranks.entries()) {
      if (score === rank.score || score < ranks[i + 1].score) {
        returnRank = rank;
        break;
      }
    }
    return returnRank;
  };

  return (
    <div className="Progress">
      <div className="ProgressRank">
        <div className="CurrentRank">{currentRank().name}</div>
        <ProgressBar ranks={ranks} currentRank={currentRank()} />
      </div>
      <FoundWordsStatus />
    </div>
  );
}
