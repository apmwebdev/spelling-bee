import { useAppSelector } from "../../../../app/hooks";
import { selectCorrectGuessWords, selectScore } from "../../guessesSlice";
import {
  selectAnswers,
  selectPangrams,
  selectPerfectPangrams,
  selectTotalPoints,
} from "../../../puzzle/puzzleSlice";

export interface FoundWordsStatusProps {
  foundWordsIncludeTotal: boolean;
  pangramsIncludeTotal: boolean;
  includePerfectPangrams: boolean;
  perfectPangramsIncludeTotal: boolean;
}

export function FoundWordsStatus({
  foundWordsIncludeTotal,
  pangramsIncludeTotal,
  includePerfectPangrams,
  perfectPangramsIncludeTotal,
}: FoundWordsStatusProps) {
  const answers = useAppSelector(selectAnswers);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);
  const pangrams = useAppSelector(selectPangrams);
  const perfectPangrams = useAppSelector(selectPerfectPangrams);
  const currentPoints = useAppSelector(selectScore);
  const totalPoints = useAppSelector(selectTotalPoints);

  const correctCount = correctGuessWords.length;
  const answerCount = answers.length;
  let countClass = "word-list-status-count ";
  let foundPointsCountClasses = countClass;
  if (correctCount === 0) {
    foundPointsCountClasses += "hint-not-started";
  } else if (correctCount === answerCount) {
    foundPointsCountClasses += "hint-completed";
  } else {
    foundPointsCountClasses += "hint-in-progress";
  }

  const foundWordsTrackingText = () => {

    let text = `${correctCount}`;
    if (foundWordsIncludeTotal) {
      text += `/${answerCount}`;
    }

    return (
      <div className="words">
        <span>Words:</span>
        <span className={foundPointsCountClasses}>{text}</span>
      </div>
    );
  };

  const pointsTrackingText = () => {
    return (
      <div className="points">
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
    if (pangramsIncludeTotal) {
      text += `/${totalPangrams}`;
    }
    let pangramCountClasses = countClass;
    if (currentPangrams === 0) {
      pangramCountClasses += "hint-not-started";
    } else if (currentPangrams === totalPangrams) {
      pangramCountClasses += "hint-completed";
    } else {
      pangramCountClasses += "hint-in-progress";
    }
    return (
      <div className="pangrams">
        <span>Pangrams:</span>
        <span className={pangramCountClasses}>{text}</span>
      </div>
    );
  };

  const perfectPangramsTrackingText = () => {
    if (includePerfectPangrams) {
      const currentPerfectPangrams = perfectPangrams.filter((p) =>
        correctGuessWords.includes(p),
      ).length;
      const totalPerfectPangrams = perfectPangrams.length;
      if (totalPerfectPangrams === 0) {
        return <div className="perfect">(no perfect)</div>;
      }
      let text = `${currentPerfectPangrams}`;
      if (perfectPangramsIncludeTotal) {
        text += `/${totalPerfectPangrams}`;
      }
      let perfectClasses = countClass;
      if (currentPerfectPangrams === 0) {
        perfectClasses += "hint-not-started";
      } else if (currentPerfectPangrams === totalPerfectPangrams) {
        perfectClasses += "hint-completed";
      } else {
        perfectClasses += "hint-in-progress";
      }
      return (
        <div className="perfect">
          <span>(Perfect: </span>
          <span className={perfectClasses}>{text}</span>
          <span>)</span>
        </div>
      );
    }
    return "";
  };

  return (
    <div className="sb-found-words-status sb-word-list-status">
      {foundWordsTrackingText()}
      {pointsTrackingText()}
      {pangramsTrackingText()}
      {perfectPangramsTrackingText()}
    </div>
  );
}
