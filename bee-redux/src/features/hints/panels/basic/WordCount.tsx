import {
  changeBasicPanelSubsectionDisplay,
  ChangeBasicPanelSubsectionDisplayPayload,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswers } from "../../../puzzle/puzzleSlice"
import { selectCorrectGuesses } from "../../../guesses/guessesSlice"
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
  const correctGuesses = useAppSelector(selectCorrectGuesses)
  const answerCount = answers.length
  const correctGuessCount = correctGuesses.length
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
          return `Words: ${remaining} / ${answerCount} remaining`
        case TrackingOptions.FoundOfTotal:
          return `Words: ${correctGuessCount} / ${answerCount} found`
        case TrackingOptions.Remaining:
          return `Remaining words: ${remaining}`
        case TrackingOptions.Found:
          return `Found words: ${correctGuessCount}`
        case TrackingOptions.Total:
          return `Total words: ${answerCount}`
      }
    }
    return "Words: hidden"
  }
  return (
    <div>
      {content()}
      <button type="button" className="standard-button" onClick={handleClick}>
        {showWordCount ? "Hide" : "Show"}
      </button>
    </div>
  )
}
