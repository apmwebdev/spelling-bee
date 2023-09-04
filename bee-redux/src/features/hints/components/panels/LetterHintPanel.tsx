import { WordCountList } from "./letter/WordCountList";
import { WordLengthGridContainer } from "./letter/WordLengthGridContainer";
import { LettersPresent } from "./letter/LettersPresent";
import { selectKnownWords } from "../../../guesses/guessesSlice";
import { useAppSelector } from "@/app/hooks";
import {
  HintPanelData,
  isLetterPanelData,
  SubstringHintOutputKeys,
} from "@/features/hints";
import { LetterHintSubsectionProps } from "@/features/hints/components/panels/letter/types";
import { selectAnswerWords } from "@/features/puzzle/puzzleSlice";

export function LetterHintPanel({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);
  const knownWords = useAppSelector(selectKnownWords);

  if (!isLetterPanelData(panel.typeData)) return;

  const { numberOfLetters, location, lettersOffset, outputType, showKnown } =
    panel.typeData;

  const subsectionProps: LetterHintSubsectionProps = {
    answers,
    knownWords,
    numberOfLetters,
    location,
    lettersOffset,
    showKnown,
    statusTracking: panel.statusTracking,
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

  return (
    <div className="LetterHintPanel">{content()}</div>
  );
}
