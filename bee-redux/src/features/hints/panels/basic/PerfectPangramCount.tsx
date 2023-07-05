import { TrackingOptions } from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectPerfectPangrams } from "../../../puzzle/puzzleSlice"
import { selectGuesses } from "../../../guesses/guessesSlice"

interface PerfectPangramCountProps {
  panelId: number
  showPerfectPangramCount: boolean
  tracking: TrackingOptions
}

export function PerfectPangramCount({
  showPerfectPangramCount,
  tracking,
}: PerfectPangramCountProps) {
  const perfectPangrams = useAppSelector(selectPerfectPangrams)
  const { guesses } = useAppSelector(selectGuesses)
  const totalPerfectPangrams = perfectPangrams.length
  const foundPerfectPangrams = guesses.filter((guess) =>
    perfectPangrams.includes(guess.word.toLowerCase()),
  ).length
  const remainingPerfectPangrams = totalPerfectPangrams - foundPerfectPangrams

  const content = () => {
    if (showPerfectPangramCount) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Perfect pangrams: ${remainingPerfectPangrams} remaining of ${totalPerfectPangrams}`
        case TrackingOptions.FoundOfTotal:
          return `Perfect pangrams: ${foundPerfectPangrams} found of ${totalPerfectPangrams}`
        case TrackingOptions.Remaining:
          return `Remaining perfect pangrams: ${remainingPerfectPangrams}`
        case TrackingOptions.Found:
          return `Found perfect pangrams: ${foundPerfectPangrams}`
        case TrackingOptions.Total:
          return `Total perfect pangrams: ${totalPerfectPangrams}`
      }
    }
    return "Perfect pangrams: hidden"
  }

  return <div>{content()}</div>
}
