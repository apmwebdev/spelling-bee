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
  tracking: StatusTrackingOptions;
}

export interface LetterHintDataCell {
  answers: number;
  guesses: number;
}

export function LetterHintPanel({ panel }: HintPanelProps) {
  const answers = useAppSelector(selectAnswerWords);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);
  const content = () => {
    if (isLetterPanelData(panel.typeData)) {
      const { numberOfLetters, location, lettersOffset, outputType } =
        panel.typeData;

      const subsectionProps: LetterHintSubsectionProps = {
        answers,
        correctGuessWords,
        numberOfLetters,
        location,
        lettersOffset,
        tracking: panel.statusTracking,
      };

      let hintContent;

      if (outputType === SubstringHintOutputTypes.WordLengthGrid) {
        hintContent = <WordLengthGrid {...subsectionProps} />;
      } else if (outputType === SubstringHintOutputTypes.WordCountList) {
        hintContent = <WordCountList {...subsectionProps} />;
      } else if (outputType === SubstringHintOutputTypes.LettersList) {
        hintContent = <LettersOnly {...subsectionProps} />;
      } else {
        hintContent = <div>hullo</div>;
      }

      const letterHintSettings = () => (
        <LetterPanelSettings
          panelId={panel.id}
          numberOfLetters={numberOfLetters}
          location={location}
          lettersOffset={lettersOffset}
          outputType={outputType}
        />
      );

      return (
        <>
          <HintPanelSettings
            panel={panel}
            TypeSettingsComponent={letterHintSettings}
          />
          <div className="sb-hint-panel-output">{hintContent}</div>
        </>
      );
    }
  };

  return <div className="sb-letter-hints">{content()}</div>;
}
