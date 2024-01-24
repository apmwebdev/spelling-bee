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
} from "@/features/progress/api/progressSelectors";

export function ProgressStatus() {
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
  let countClass = "ProgressStatusCount ";

  let knownPointsCountClasses = countClass;
  if (correctCount === 0) {
    knownPointsCountClasses += "ErrorText";
  } else if (correctCount === answerCount) {
    knownPointsCountClasses += "SuccessText";
  } else {
    knownPointsCountClasses += "WarningText";
  }

  const knownWordsTrackingText = () => {
    let text = `${correctCount}`;
    if (wordsShowTotal) {
      text += `/${answerCount}`;
    }

    return (
      <div className="words ProgressStatus_item">
        <span>Words:</span>
        <span className={knownPointsCountClasses}>{text}</span>
      </div>
    );
  };

  const pointsTrackingText = () => {
    return (
      <div className="points ProgressStatus_item">
        <span>Points:</span>
        <span
          className={knownPointsCountClasses}
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
    let pangramCountClasses = countClass;
    if (currentPangrams === 0) {
      pangramCountClasses += "ErrorText";
    } else if (currentPangrams === totalPangrams) {
      pangramCountClasses += "SuccessText";
    } else {
      pangramCountClasses += "WarningText";
    }
    return (
      <div className="pangrams ProgressStatus_item">
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
      let perfectClasses = countClass;
      if (currentPerfectPangrams === 0) {
        perfectClasses += "ErrorText";
      } else if (currentPerfectPangrams === totalPerfectPangrams) {
        perfectClasses += "SuccessText";
      } else {
        perfectClasses += "WarningText";
      }
      return (
        <div className="perfect ProgressStatus_item">
          <span>(Perfect: </span>
          <span className={perfectClasses}>{text}</span>
          <span>)</span>
        </div>
      );
    }
    return "";
  };

  return (
    <div className="ProgressStatus">
      {knownWordsTrackingText()}
      {pointsTrackingText()}
      {pangramsTrackingText()}
      {perfectPangramsTrackingText()}
    </div>
  );
}
