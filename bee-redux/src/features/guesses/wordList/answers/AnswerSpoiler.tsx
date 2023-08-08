import { useAppSelector } from "../../../../app/hooks";
import { selectAnswersListSettings } from "../wordListSettingsSlice";
import { useDispatch } from "react-redux";
import { GuessFormData, spoilWord } from "../../guessesSlice";

export function AnswerSpoiler({ word }: { word: string }) {
  const dispatch = useDispatch();
  const { remainingRevealFirstLetter, remainingRevealLength } = useAppSelector(
    selectAnswersListSettings,
  );

  const determineWidth = () => {
    const minWidth = 72;
    const widthMultiplier = 16;
    const maxWidth = 136;
    if (!remainingRevealLength) {
      return minWidth;
    }
    const customWidth = word.length * widthMultiplier + 8;
    if (maxWidth > customWidth && customWidth > minWidth) {
      return customWidth;
    }
    if (customWidth > maxWidth) return maxWidth;
    return minWidth;
  };

  const spoiler = (spoilerText: string) => {
    const spoilerData: GuessFormData = {
      word,
      isAnswer: true,
      isExcluded: false,
      isSpoiled: true,
    };

    return (
      <button
        className="sb-revealer"
        style={{ width: `${determineWidth()}px` }}
        onClick={() => dispatch(spoilWord(spoilerData))}
      >
        {spoilerText}
      </button>
    );
  };

  const content = () => {
    if (!remainingRevealFirstLetter && !remainingRevealLength) {
      return spoiler("...");
    }
    if (remainingRevealFirstLetter && !remainingRevealLength) {
      return spoiler(`${word[0].toUpperCase()}...`);
    }
    if (!remainingRevealFirstLetter && remainingRevealLength) {
      return spoiler(`${word.length}`);
    }
    if (remainingRevealFirstLetter && remainingRevealLength) {
      return spoiler(`${word[0].toUpperCase()}... ${word.length}`);
    }
  };

  return content();
}
