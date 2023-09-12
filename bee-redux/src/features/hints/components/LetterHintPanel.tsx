import { WordCountList } from "@/features/hints/components/letterPanel/WordCountList";
import { WordLengthGridContainer } from "@/features/hints/components/letterPanel/WordLengthGridContainer";
import { LettersPresent } from "@/features/hints/components/letterPanel/LettersPresent";
import {
  isLetterPanelData,
  LetterPanelData,
  StatusTrackingKeys,
  SubstringHintOutputKeys,
} from "@/features/hints";
import { LetterHintSubsectionProps } from "@/features/hints/components/letterPanel/types";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle/puzzleSlice";
import { selectKnownWords } from "@/features/guesses/guessesSlice";

export function LetterHintPanel({
  letterData,
  statusTracking,
}: {
  letterData: LetterPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const answers = useAppSelector(selectAnswerWords);
  const knownWords = useAppSelector(selectKnownWords);

  if (!isLetterPanelData(letterData)) return;

  const { numberOfLetters, location, lettersOffset, outputType, hideKnown } =
    letterData;

  const subsectionProps: LetterHintSubsectionProps = {
    answers,
    knownWords,
    numberOfLetters,
    location,
    lettersOffset,
    hideKnown,
    statusTracking,
  };

  const content = () => {
    if (outputType === SubstringHintOutputKeys.WordLengthGrid) {
      return <WordLengthGridContainer {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.WordCountList) {
      return <WordCountList {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.LettersPresent) {
      return <LettersPresent {...subsectionProps} />;
    }
  };

  return <div className="LetterHintPanel">{content()}</div>;
}
