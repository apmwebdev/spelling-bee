/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ProgressBar } from "@/features/progress/components/ProgressBar";
import { MobileProgressStatus } from "@/features/progress/components/mobile/MobileProgressStatus";
import { MobileRankStatus } from "@/features/progress/components/mobile/MobileRankStatus";

export function MobileProgress() {
  return (
    <div className="MobileProgress">
      <div className="MobileProgress_rankSection">
        <MobileRankStatus />
        <ProgressBar />
      </div>
      <MobileProgressStatus />
    </div>
  );
}
