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
import { selectKnownWordsListSettings } from "@/features/wordLists";
import {
  selectAnswerProgress,
  selectPangramProgress,
  selectPerfectPangramProgress,
} from "@/features/progress/api/progressSlice";
import { KnownWordsStatusItem } from "@/features/wordLists/components/knownWords/KnownWordsStatusItem";

export function KnownWordsStatus() {
  const answerProgress = useAppSelector(selectAnswerProgress);
  const pangramProgress = useAppSelector(selectPangramProgress);
  const perfectProgress = useAppSelector(selectPerfectPangramProgress);
  const { wordsShowTotal } = useAppSelector(selectKnownWordsListSettings);
  const { pangramsShowTotal, showPerfectPangrams, perfectPangramsShowTotal } =
    useAppSelector(selectKnownWordsListSettings);

  return (
    <div className="WordListStatus KnownWordsStatus">
      <KnownWordsStatusItem
        label="Words"
        wordData={answerProgress}
        showTotal={wordsShowTotal}
      />
      <KnownWordsStatusItem
        label="Pangrams"
        wordData={pangramProgress}
        showTotal={pangramsShowTotal}
      />
      <KnownWordsStatusItem
        label="Perfects"
        wordData={perfectProgress}
        showTotal={perfectPangramsShowTotal}
        hide={!showPerfectPangrams}
      />
    </div>
  );
}
