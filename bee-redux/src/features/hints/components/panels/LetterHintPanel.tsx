import { HintPanelProps } from "../HintPanel";
import { LetterPanelSettings } from "./letter/LetterPanelSettings";
import { WordCountList } from "./letter/WordCountList";
import { WordLengthGrid } from "./letter/WordLengthGrid";
import { LettersOnly } from "./letter/LettersOnly";
import { selectCorrectGuessWords } from "../../../guesses/guessesSlice";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "../../../puzzle/puzzleSlice";
import { HintPanelSettings } from "../HintPanelSettings";
import {
  isLetterPanelData,
  LetterPanelLocations,
  StatusTrackingOptions,
  SubstringHintOutputTypes,
} from "@/features/hints";

export interface LetterHintSubsectionProps {
  answers: string[];
  correctGuessWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocations;
  lettersOffset: number;
  statusTracking: StatusTrackingOptions;
}

export interface LetterHintDataCell {
  answers: number;
  guesses: number;
}

export function LetterHintPanel({ panel }: HintPanelProps) {
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
    if (outputType === SubstringHintOutputTypes.WordLengthGrid) {
      return <WordLengthGrid {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputTypes.WordCountList) {
      return <WordCountList {...subsectionProps} />;
    } else if (outputType === SubstringHintOutputTypes.LettersList) {
      return <LettersOnly {...subsectionProps} />;
    }
  };

  return (
    <div className="sb-letter-hints">
      <HintPanelSettings panel={panel}>
        <LetterPanelSettings
          panelId={panel.id}
          numberOfLetters={numberOfLetters}
          location={location}
          lettersOffset={lettersOffset}
          outputType={outputType}
        />
      </HintPanelSettings>
      <div className="sb-hint-panel-output">{hintOutput()}</div>
    </div>
  );
}
