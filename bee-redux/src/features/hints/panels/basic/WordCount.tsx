import {
  changeBasicPanelSubsectionDisplay,
  ChangeBasicPanelSubsectionDisplayPayload,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswers } from "../../../puzzle/puzzleSlice"
import { selectGuesses } from "../../../guesses/guessesSlice"
import { useDispatch } from "react-redux"

interface WordCountProps {
  panelId: number
  showWordCount: boolean
  tracking: TrackingOptions
}

export function WordCount({
  panelId,
  showWordCount,
  tracking,
}: WordCountProps) {
  const dispatch = useDispatch()
  const answers = useAppSelector(selectAnswers)
  const { guesses } = useAppSelector(selectGuesses)
  const answerCount = answers.length
  const correctGuessCount = guesses.filter((guess) => guess.isAnswer).length
  const remaining = answerCount - correctGuessCount

  const handleClick = () => {
    const payload: ChangeBasicPanelSubsectionDisplayPayload = {
      panelId: panelId,
      settingName: "showWordCount",
      newValue: !showWordCount,
    }
    dispatch(changeBasicPanelSubsectionDisplay(payload))
  }

  const content = () => {
    if (showWordCount) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Word count: ${remaining} remaining of ${answerCount}`
        case TrackingOptions.FoundOfTotal:
          return `Word count: ${correctGuessCount} found of ${answerCount}`
        case TrackingOptions.Remaining:
          return `Remaining words: ${remaining}`
        case TrackingOptions.Found:
          return `Found words: ${correctGuessCount}`
        case TrackingOptions.Total:
          return `Total words: ${answerCount}`
      }
    }
    return "Word count: hidden"
  }
  return (
    <div>
      {content()}
      <button type="button" onClick={handleClick}>
        Toggle
      </button>
    </div>
  )
}
