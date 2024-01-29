/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ProgressRank } from "@/features/progress/components/ProgressRank";
import { ProgressBar } from "@/features/progress/components/ProgressBar";
import { ProgressNumbers } from "@/features/progress/components/ProgressNumbers";

export function Progress() {
  return (
    <div className="Progress">
      <ProgressNumbers />
      <div className="Progress_rankSection">
        <ProgressBar />
        <ProgressRank />
      </div>
    </div>
  );
}
