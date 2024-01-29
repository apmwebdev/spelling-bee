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
import { selectRanks } from "@/features/puzzle";
import { selectCurrentOrBlankRank } from "@/features/progress/api/progressSlice";
import classNames from "classnames/dedupe";

export function ProgressBar() {
  const ranks = useAppSelector(selectRanks);
  const currentRank = useAppSelector(selectCurrentOrBlankRank);

  const content = () => {
    if (ranks.length > 0) {
      return ranks.map((rank) => {
        return (
          <div
            key={rank.baseRank.level}
            className={classNames("RankTic", {
              RankTic___active: rank === currentRank,
            })}
          ></div>
        );
      });
    }
    // If ranks.length === 0, it's a blank puzzle. Return a blank progress bar.
    const returnArray = [];
    for (let i = 0; i < 10; i++) {
      returnArray.push(<div key={i} className="RankTic"></div>);
    }
    return returnArray;
  };

  return <div className="ProgressBar">{content()}</div>;
}
