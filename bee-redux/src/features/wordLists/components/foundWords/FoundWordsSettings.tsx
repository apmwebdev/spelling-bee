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
  selectFoundWordsListSettings,
  setFoundWordsPangramsShowTotal,
  setFoundWordsPerfectPangramsShowTotal,
  setFoundWordsShowPerfectPangrams,
  setFoundWordsWordsShowTotal,
} from "@/features/wordLists";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export function FoundWordsSettings() {
  const dispatch = useAppDispatch();
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectFoundWordsListSettings);
  return (
    <div className="WordListSettingsContent found">
      <label>
        <input
          type="checkbox"
          checked={wordsShowTotal}
          onChange={(e) =>
            dispatch(setFoundWordsWordsShowTotal(e.target.checked))
          }
        />
        <span>Show total words</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={pangramsShowTotal}
          onChange={(e) =>
            dispatch(setFoundWordsPangramsShowTotal(e.target.checked))
          }
        />
        <span>Show total pangrams</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={showPerfectPangrams}
          onChange={(e) =>
            dispatch(setFoundWordsShowPerfectPangrams(e.target.checked))
          }
        />
        <span>Include perfect pangrams</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={perfectPangramsShowTotal}
          disabled={!showPerfectPangrams}
          onChange={(e) =>
            dispatch(setFoundWordsPerfectPangramsShowTotal(e.target.checked))
          }
        />
        <span className={showPerfectPangrams ? "" : "disabled"}>
          Show total perfect pangrams
        </span>
      </label>
    </div>
  );
}
