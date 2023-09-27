import { WordCountList } from "./WordCountList";
import { WordLengthGridContainer } from "./WordLengthGridContainer";
import { LettersPresent } from "./LettersPresent";
import {
  isLetterPanelData,
  LetterHintSubsectionProps,
  LetterPanelData,
} from "../types";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords, selectKnownWords } from "@/features/puzzle";
import {
  StatusTrackingKeys,
  SubstringHintOutputKeys,
} from "@/features/hintPanels";

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
