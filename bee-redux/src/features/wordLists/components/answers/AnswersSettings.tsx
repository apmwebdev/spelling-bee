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

export function AnswersSettings() {
  const dispatch = useAppDispatch();
  const {
    remainingAndSpoiledOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  } = useAppSelector(selectAnswersListSettings);
  return (
    <div className="WordListSettingsContent answers">
      <label>
        <input
          type="checkbox"
          checked={remainingAndSpoiledOnly}
          onChange={(e) =>
            dispatch(setAnswersRemainingAndSpoiledOnly(e.target.checked))
          }
        />
        <span>Show spoiled and unrevealed answers only</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingRevealFirstLetter}
          onChange={(e) =>
            dispatch(setAnswersRemainingRevealFirstLetter(e.target.checked))
          }
        />
        <span>Show first letter of unrevealed answers</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingRevealLength}
          onChange={(e) =>
            dispatch(setAnswersRemainingRevealLength(e.target.checked))
          }
        />
        <span>Show length of unrevealed answers</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingGroupWithLetter}
          disabled={!remainingRevealFirstLetter}
          onChange={(e) =>
            dispatch(setAnswersRemainingGroupWithLetter(e.target.checked))
          }
        />
        <span className={remainingRevealFirstLetter ? "" : "disabled"}>
          Group unrevealed answers by first letter
        </span>
      </label>
      <div>
        <ToggleGroup.Root
          type="single"
          value={remainingLocation}
          onValueChange={(val) => dispatch(setAnswersRemainingLocation(val))}
        >
          <ToggleGroup.Item value="beginning">Beginning</ToggleGroup.Item>
          <ToggleGroup.Item value="end">End</ToggleGroup.Item>
        </ToggleGroup.Root>
        <span>Show remaining answers at the {remainingLocation}</span>
      </div>
    </div>
  );
}
