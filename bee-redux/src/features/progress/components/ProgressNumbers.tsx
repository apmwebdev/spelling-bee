/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AnswersNumberStatus } from "@/features/progress/components/progressStatus/AnswersNumberStatus";
import { ScoreNumberStatus } from "@/features/progress/components/progressStatus/ScoreNumberStatus";
import { PercentageNumberStatus } from "@/features/progress/components/progressStatus/PercentageNumberStatus";

export function ProgressNumbers() {
  return (
    <div className="ProgressNumbers">
      <AnswersNumberStatus />
      <ScoreNumberStatus />
      <PercentageNumberStatus />
    </div>
  );
}
