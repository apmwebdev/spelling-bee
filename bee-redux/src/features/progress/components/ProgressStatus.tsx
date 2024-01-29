/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AnswersStatus } from "@/features/progress/components/progressStatus/AnswersStatus";
import { ScoreStatus } from "@/features/progress/components/progressStatus/ScoreStatus";
import { PercentageStatus } from "@/features/progress/components/progressStatus/PercentageStatus";
import { RankStatus } from "@/features/progress/components/progressStatus/RankStatus";

export function ProgressStatus() {
  return (
    <div className="ProgressStatus">
      <AnswersStatus />
      <PercentageStatus />
      <ScoreStatus />
      <RankStatus />
    </div>
  );
}
