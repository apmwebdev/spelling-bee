/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  selectKnownWordsListSettings,
  setKnownWordsPangramsShowTotal,
  setKnownWordsPerfectPangramsShowTotal,
  setKnownWordsShowPerfectPangrams,
  setKnownWordsWordsShowTotal,
} from "@/features/wordLists";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Checkbox } from "@/components/radix-ui/radix-checkbox";

export function KnownWordsSettings() {
  const dispatch = useAppDispatch();
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectKnownWordsListSettings);
  return (
    <div className="WordListSettings KnownWordsSettings">
      <label className="WordListSettings_item">
        <Checkbox
          checked={wordsShowTotal}
          onCheckedChange={(isChecked) =>
            dispatch(setKnownWordsWordsShowTotal(Boolean(isChecked)))
          }
        />
        <span>Show total words</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={pangramsShowTotal}
          onCheckedChange={(isChecked) =>
            dispatch(setKnownWordsPangramsShowTotal(Boolean(isChecked)))
          }
        />
        <span>Show total pangrams</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={showPerfectPangrams}
          onCheckedChange={(isChecked) =>
            dispatch(setKnownWordsShowPerfectPangrams(Boolean(isChecked)))
          }
        />
        <span>Include perfect pangrams</span>
      </label>
      <label className="WordListSettings_item">
        <Checkbox
          checked={perfectPangramsShowTotal}
          disabled={!showPerfectPangrams}
          onCheckedChange={(isChecked) =>
            dispatch(setKnownWordsPerfectPangramsShowTotal(Boolean(isChecked)))
          }
        />
        <span className={showPerfectPangrams ? "" : "disabled"}>
          Show total perfect pangrams
        </span>
      </label>
    </div>
  );
}
