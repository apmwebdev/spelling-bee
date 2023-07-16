import { HintPanelProps } from "../HintPanel"
import {
  isLetterPanelSettings,
  LetterPanelLocations,
  StringHintDisplayOptions,
  TrackingOptions,
} from "../hintProfilesSlice"
import { LetterPanelSettings } from "./letter/LetterPanelSettings"
import { WordCountList } from "./letter/WordCountList"
import { WordLengthGrid } from "./letter/WordLengthGrid"
import { LettersOnly } from "./letter/LettersOnly"
import { selectCorrectGuessWords } from "../../guesses/guessesSlice"
import { useAppSelector } from "../../../app/hooks"
import { selectAnswers } from "../../puzzle/puzzleSlice"
import { HintPanelSettings } from "../HintPanelSettings"

export interface LetterHintSubsectionProps {
  answers: string[]
  correctGuessWords: string[]
  numberOfLetters: number
  locationInWord: LetterPanelLocations
  offset: number
  tracking: TrackingOptions
}

export interface LetterHintDataCell {
  answers: number
  guesses: number
}

export function LetterHintPanel({ panel }: HintPanelProps) {
  const answers = useAppSelector(selectAnswers)
  const correctGuessWords = useAppSelector(selectCorrectGuessWords)
  const content = () => {
    if (isLetterPanelSettings(panel.typeSpecificData)) {
      const { numberOfLetters, locationInWord, offset, display } =
        panel.typeSpecificData

      const subsectionProps: LetterHintSubsectionProps = {
        answers,
        correctGuessWords,
        numberOfLetters,
        locationInWord,
        offset,
        tracking: panel.tracking,
      }

      let hintContent

      if (display === StringHintDisplayOptions.WordLengthGrid) {
        hintContent = <WordLengthGrid {...subsectionProps} />
      } else if (display === StringHintDisplayOptions.WordCountList) {
        hintContent = <WordCountList {...subsectionProps} />
      } else if (display === StringHintDisplayOptions.LettersOnly) {
        hintContent = <LettersOnly {...subsectionProps} />
      } else {
        hintContent = <div>hullo</div>
      }

      const letterHintSettings = () => (
        <LetterPanelSettings
          panelId={panel.id}
          numberOfLetters={numberOfLetters}
          locationInWord={locationInWord}
          offset={offset}
          display={display}
        />
      )

      return (
        <>
          <HintPanelSettings
            panel={panel}
            TypeSettingsComponent={letterHintSettings}
          />
          <div className="sb-hint-panel-output">{hintContent}</div>
        </>
      )
    }
  }

  return <div className="sb-letter-hints">{content()}</div>
}
