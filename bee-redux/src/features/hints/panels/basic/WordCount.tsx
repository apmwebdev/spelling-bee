import { TrackingOptions } from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswers } from "../../../puzzle/puzzleSlice"
import { selectGuesses } from "../../../guesses/guessesSlice"

interface WordCountProps {
  showWordCount: boolean
  tracking: TrackingOptions
}

export function WordCount({ showWordCount, tracking }: WordCountProps) {
  const answers = useAppSelector(selectAnswers)
  const { guesses } = useAppSelector(selectGuesses)
  const answerCount = answers.length
  const correctGuessCount = guesses.filter((guess) => guess.isAnswer).length
  const remaining = answerCount - correctGuessCount

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
  return <div>{content()}</div>
}
