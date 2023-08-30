import { WordCountList } from "./letter/WordCountList";
import { WordLengthGridContainer } from "./letter/WordLengthGridContainer";
import { LettersOnly } from "./letter/LettersOnly";
import { selectCorrectGuessWords } from "../../../guesses/guessesSlice";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "../../../puzzle/puzzleSlice";
import {
  HintPanelData,
  isLetterPanelData,
  LetterPanelLocations,
  StatusTrackingKeys,
  SubstringHintOutputKeys,
} from "@/features/hints";

export interface LetterHintSubsectionProps {
  answers: string[];
  correctGuessWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocations;
  lettersOffset: number;
  statusTracking: StatusTrackingKeys;
}

export interface LetterHintDataCell {
  answers: number;
  guesses: number;
}

export function LetterHintPanel({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);

  if (!isLetterPanelData(panel.typeData)) return;

  const { numberOfLetters, location, lettersOffset, outputType } =
    panel.typeData;

  const subsectionProps: LetterHintSubsectionProps = {
    answers,
    correctGuessWords,
    numberOfLetters,
    location,
    lettersOffset,
    statusTracking: panel.statusTracking,
  };

  const hintOutput = () => {
    if (outputType === SubstringHintOutputKeys.WordLengthGrid) {
      return <WordLengthGridContainer {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.WordCountList) {
      return <WordCountList {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputKeys.LettersList) {
      return <LettersOnly {...subsectionProps} />;
    }
  };

  return (
    <div className="sb-letter-hints">
      <div className="sb-hint-panel-output">{hintOutput()}</div>
    </div>
  );
}
