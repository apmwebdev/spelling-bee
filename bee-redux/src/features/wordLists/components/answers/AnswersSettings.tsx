/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAnswersListSettings,
  setAnswersRemainingAndSpoiledOnly,
  setAnswersRemainingGroupWithLetter,
  setAnswersRemainingLocation,
  setAnswersRemainingRevealFirstLetter,
  setAnswersRemainingRevealLength,
} from "@/features/wordLists";
import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { Checkbox } from "@/components/radix-ui/radix-checkbox";

export function AnswersSettings() {
  const dispatch = useAppDispatch();
  const {
    remainingAndSpoiledOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  } = useAppSelector(selectAnswersListSettings);

  const handleRemainingLocationChange = (value: string) => {
    /* Ensure that one of the two options is always selected.
     * By default, clicking an already-selected button in a toggle group will send an empty string
     * to the change event, effectively deselecting all options. This prevents that.
     */
    if (value !== "") dispatch(setAnswersRemainingLocation(value));
  };

  return (
    <div className="WordListSettings AnswersSettings">
      <label className="WordListSettings_item">
        <Checkbox
          checked={remainingAndSpoiledOnly}
          onCheckedChange={(isChecked) =>
            dispatch(setAnswersRemainingAndSpoiledOnly(isChecked))
          }
        />
        <span>Show spoiled and unrevealed answers only</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={remainingRevealFirstLetter}
          onCheckedChange={(isChecked) =>
            dispatch(setAnswersRemainingRevealFirstLetter(isChecked))
          }
        />
        <span>Show first letter of unrevealed answers</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={remainingRevealLength}
          onCheckedChange={(isChecked) =>
            dispatch(setAnswersRemainingRevealLength(isChecked))
          }
        />
        <span>Show length of unrevealed answers</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={remainingGroupWithLetter}
          disabled={!remainingRevealFirstLetter}
          onCheckedChange={(isChecked) =>
            dispatch(setAnswersRemainingGroupWithLetter(isChecked))
          }
        />
        <span className={remainingRevealFirstLetter ? "" : "disabled"}>
          Group unrevealed answers by first letter
        </span>
      </label>
      <div className="WordListSettings_item AnswersSettings_remainingLocation">
        <div>Show remaining answers at the:</div>
        <ToggleGroup.Root
          type="single"
          value={remainingLocation}
          onValueChange={(val) => handleRemainingLocationChange(val)}
        >
          <ToggleGroup.Item value="beginning">Beginning</ToggleGroup.Item>
          <ToggleGroup.Item value="end">End</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </div>
  );
}
