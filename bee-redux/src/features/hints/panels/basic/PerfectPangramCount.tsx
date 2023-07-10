import {
  changeBasicPanelSubsectionDisplay,
  ChangeBasicPanelSubsectionDisplayPayload,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectPerfectPangrams } from "../../../puzzle/puzzleSlice"
import { selectCorrectGuesses } from "../../../guesses/guessesSlice"
import { useDispatch } from "react-redux"

interface PerfectPangramCountProps {
  panelId: number
  showPerfectPangramCount: boolean
  tracking: TrackingOptions
}

export function PerfectPangramCount({
  panelId,
  showPerfectPangramCount,
  tracking,
}: PerfectPangramCountProps) {
  const dispatch = useDispatch()
  const perfectPangrams = useAppSelector(selectPerfectPangrams)
  const correctGuesses = useAppSelector(selectCorrectGuesses)
  const totalPerfectPangrams = perfectPangrams.length
  const foundPerfectPangrams = correctGuesses.filter((guess) =>
    perfectPangrams.includes(guess.word.toLowerCase()),
  ).length
  const remainingPerfectPangrams = totalPerfectPangrams - foundPerfectPangrams

  const handleClick = () => {
    const payload: ChangeBasicPanelSubsectionDisplayPayload = {
      panelId: panelId,
      settingName: "showPerfectPangramCount",
      newValue: !showPerfectPangramCount,
    }
    dispatch(changeBasicPanelSubsectionDisplay(payload))
  }

  const content = () => {
    if (showPerfectPangramCount) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Perfect pangrams: ${remainingPerfectPangrams} / ${totalPerfectPangrams} remaining`
        case TrackingOptions.FoundOfTotal:
          return `Perfect pangrams: ${foundPerfectPangrams} / ${totalPerfectPangrams} found`
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

  return (
    <div>
      {content()}
      <button type="button" onClick={handleClick}>
        {showPerfectPangramCount ? "Hide" : "Show"}
      </button>
    </div>
  )
}
