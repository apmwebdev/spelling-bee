import { TrackingOptions } from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectPangrams } from "../../../puzzle/puzzleSlice"
import { selectGuesses } from "../../../guesses/guessesSlice"

interface PangramCountProps {
  panelId: number
  showPangramCount: boolean
  tracking: TrackingOptions
}

export function PangramCount({
  showPangramCount,
  tracking,
}: PangramCountProps) {
  const pangrams = useAppSelector(selectPangrams)
  const { guesses } = useAppSelector(selectGuesses)
  const totalPangrams = pangrams.length
  const foundPangrams = guesses.filter((guess) =>
    pangrams.includes(guess.word.toLowerCase()),
  ).length
  const remainingPangrams = totalPangrams - foundPangrams

  const content = () => {
    if (showPangramCount) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Pangrams: ${remainingPangrams} remaining of ${totalPangrams}`
        case TrackingOptions.FoundOfTotal:
          return `Pangrams: ${foundPangrams} found of ${totalPangrams}`
        case TrackingOptions.Remaining:
          return `Remaining pangrams: ${remainingPangrams}`
        case TrackingOptions.Found:
          return `Found pangrams: ${foundPangrams}`
        case TrackingOptions.Total:
          return `Total pangrams: ${totalPangrams}`
      }
    }
    return "Pangrams: hidden"
  }

  return <div>{content()}</div>
}
