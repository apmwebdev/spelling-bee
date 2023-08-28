import { useAppSelector } from "@/app/hooks";
import { selectAnswersListSettings } from "../wordListSettingsSlice";
import {
  GuessFormData,
  selectCurrentAttempt,
} from "../../guesses/guessesSlice";
import { useAddGuessMutation } from "../../guesses/guessesApiSlice";

export function AnswerSpoiler({ word }: { word: string }) {
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const [addGuess] = useAddGuessMutation();
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
      guess: {
        user_puzzle_attempt_id: currentAttempt.id,
        text: word,
        is_spoiled: true,
      },
    };

    return (
      <button
        className="sb-revealer"
        style={{ width: `${determineWidth()}px` }}
        onClick={() => addGuess(spoilerData)}
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
