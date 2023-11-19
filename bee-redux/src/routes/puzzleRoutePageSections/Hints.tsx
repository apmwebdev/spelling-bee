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

import { Statuses } from "@/types";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { HintPanels, selectCurrentPanelData } from "@/features/hintPanels";

export function Hints() {
  const currentProfile = useAppSelector(selectCurrentPanelData);
  const profiles =
    hintProfilesApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const content = () => {
    if (currentProfile.status === Statuses.UpToDate && profiles.isSuccess) {
      return (
        <>
          {/*<HintProfiles />*/}
          <HintPanels />
        </>
      );
    }
  };

  return <div className="Hints PuzzleMain_section">{content()}</div>;
}
