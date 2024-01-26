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
import {
  selectAnswers,
  selectPangrams,
  selectPerfectPangrams,
  selectTotalPoints,
} from "@/features/puzzle";
import { selectKnownWordsListSettings } from "@/features/wordLists";
import {
  selectCorrectGuessWords,
  selectScore,
} from "@/features/progress/api/progressSlice";
import { trackingStatusClasses } from "@/util";

export function KnownWordsStatus() {
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectKnownWordsListSettings);
  const answers = useAppSelector(selectAnswers);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);
  const pangrams = useAppSelector(selectPangrams);
  const perfectPangrams = useAppSelector(selectPerfectPangrams);
  const currentPoints = useAppSelector(selectScore);
  const totalPoints = useAppSelector(selectTotalPoints);

  const correctCount = correctGuessWords.length;
  const answerCount = answers.length;
  const COUNT_BASE_CLASS = "WordListStatusCount";
  const statusClasses = trackingStatusClasses({
    baseClass: COUNT_BASE_CLASS,
    currentCount: correctCount,
    totalCount: answerCount,
  });

  const knownWordsTrackingText = () => {
    let text = `${correctCount}`;
    if (wordsShowTotal) {
      text += `/${answerCount}`;
    }

    return (
      <div className="words KnownWordsStatus_item">
        <span>Words:</span>
        <span className={statusClasses}>{text}</span>
      </div>
    );
  };

  const pointsTrackingText = () => {
    return (
      <div className="points KnownWordsStatus_item">
        <span>Points:</span>
        <span
          className={statusClasses}
        >{`${currentPoints}/${totalPoints}`}</span>
      </div>
    );
  };

  const pangramsTrackingText = () => {
    const currentPangrams = pangrams.filter((p) =>
      correctGuessWords.includes(p),
    ).length;
    const totalPangrams = pangrams.length;
    let text = `${currentPangrams}`;
    if (pangramsShowTotal) {
      text += `/${totalPangrams}`;
    }
    const pangramCountClasses = trackingStatusClasses({
      baseClass: COUNT_BASE_CLASS,
      currentCount: currentPangrams,
      totalCount: totalPangrams,
    });
    return (
      <div className="pangrams KnownWordsStatus_item">
        <span>Pangrams:</span>
        <span className={pangramCountClasses}>{text}</span>
      </div>
    );
  };

  const perfectPangramsTrackingText = () => {
    if (showPerfectPangrams) {
      const currentPerfectPangrams = perfectPangrams.filter((p) =>
        correctGuessWords.includes(p),
      ).length;
      const totalPerfectPangrams = perfectPangrams.length;
      if (totalPerfectPangrams === 0) {
        return <div className="perfect">(no perfect)</div>;
      }
      let text = `${currentPerfectPangrams}`;
      if (perfectPangramsShowTotal) {
        text += `/${totalPerfectPangrams}`;
      }
      const perfectClasses = trackingStatusClasses({
        baseClass: COUNT_BASE_CLASS,
        currentCount: currentPerfectPangrams,
        totalCount: totalPerfectPangrams,
      });
      return (
        <div className="perfect KnownWordsStatus_item">
          <span>(Perfect: </span>
          <span className={perfectClasses}>{text}</span>
          <span>)</span>
        </div>
      );
    }
    return "";
  };

  return (
    <div className="WordListStatus KnownWordsStatus">
      {knownWordsTrackingText()}
      {pointsTrackingText()}
      {pangramsTrackingText()}
      {perfectPangramsTrackingText()}
    </div>
  );
}
