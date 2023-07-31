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

  const foundWordsTrackingText = () => {
    const correctCount = correctGuessWords.length;
    const answerCount = answers.length;

    let text = `Words: ${correctCount}`;
    if (foundWordsIncludeTotal) {
      text += `/${answerCount}`;
    }
    return text + " | ";
  };

  const pointsTrackingText = () => {
    return `Points: ${currentPoints}/${totalPoints} | `;
  };

  const pangramsTrackingText = () => {
    const currentPangrams = pangrams.filter((p) =>
      correctGuessWords.includes(p),
    ).length;
    const totalPangrams = pangrams.length;
    let text = `Pangrams: ${currentPangrams}`;
    if (pangramsIncludeTotal) {
      text += `/${totalPangrams}`;
    }
    return text;
  };

  const perfectPangramsTrackingText = () => {
    if (includePerfectPangrams) {
      const currentPerfectPangrams = perfectPangrams.filter((p) =>
        correctGuessWords.includes(p),
      ).length;
      const totalPerfectPangrams = perfectPangrams.length;
      if (totalPerfectPangrams === 0) {
        return " (no perfect)";
      }
      let text = ` (Perfect: ${currentPerfectPangrams}`;
      if (perfectPangramsIncludeTotal) {
        text += `/${totalPerfectPangrams}`;
      }
      return text + ")";
    }
    return "";
  };

  return (
    <div className="sb-found-words-status sb-word-list-status">
      {`${foundWordsTrackingText()} ${pointsTrackingText()} ${pangramsTrackingText()}${perfectPangramsTrackingText()}`}
    </div>
  );
}
