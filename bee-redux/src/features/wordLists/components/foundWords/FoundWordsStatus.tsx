import { useAppSelector } from "@/app/hooks";
import { selectCorrectGuessWords, selectScore } from "@/features/guesses";
import {
  selectAnswers,
  selectPangrams,
  selectPerfectPangrams,
  selectTotalPoints,
} from "@/features/puzzle";
import { selectFoundWordsListSettings } from "@/features/wordLists";

export function FoundWordsStatus() {
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectFoundWordsListSettings);
  const answers = useAppSelector(selectAnswers);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);
  const pangrams = useAppSelector(selectPangrams);
  const perfectPangrams = useAppSelector(selectPerfectPangrams);
  const currentPoints = useAppSelector(selectScore);
  const totalPoints = useAppSelector(selectTotalPoints);

  const correctCount = correctGuessWords.length;
  const answerCount = answers.length;
  let countClass = "ProgressStatusCount ";

  let foundPointsCountClasses = countClass;
  if (correctCount === 0) {
    foundPointsCountClasses += "ErrorText";
  } else if (correctCount === answerCount) {
    foundPointsCountClasses += "SuccessText";
  } else {
    foundPointsCountClasses += "WarningText";
  }

  const foundWordsTrackingText = () => {
    let text = `${correctCount}`;
    if (wordsShowTotal) {
      text += `/${answerCount}`;
    }

    return (
      <div className="words ProgressStatus_item">
        <span>Words:</span>
        <span className={foundPointsCountClasses}>{text}</span>
      </div>
    );
  };

  const pointsTrackingText = () => {
    return (
      <div className="points ProgressStatus_item">
        <span>Points:</span>
        <span
          className={foundPointsCountClasses}
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
      {foundWordsTrackingText()}
      {pointsTrackingText()}
      {pangramsTrackingText()}
      {perfectPangramsTrackingText()}
    </div>
  );
}
