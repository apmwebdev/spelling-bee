import {
  changeBasicPanelSubsectionDisplay,
  ChangeBasicPanelSubsectionDisplayPayload,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectTotalPoints } from "../../../puzzle/puzzleSlice"
import { selectScore } from "../../../guesses/guessesSlice"
import { useDispatch } from "react-redux"

interface TotalPointsProps {
  panelId: number
  showTotalPoints: boolean
  tracking: TrackingOptions
}

export function TotalPoints({
  panelId,
  showTotalPoints,
  tracking,
}: TotalPointsProps) {
  const dispatch = useDispatch()
  const totalPoints = useAppSelector(selectTotalPoints)
  const currentScore = useAppSelector(selectScore)
  const remainingPoints = totalPoints - currentScore

  const handleClick = () => {
    const payload: ChangeBasicPanelSubsectionDisplayPayload = {
      panelId: panelId,
      settingName: "showTotalPoints",
      newValue: !showTotalPoints,
    }
    dispatch(changeBasicPanelSubsectionDisplay(payload))
  }

  const content = () => {
    if (showTotalPoints) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Points: ${remainingPoints} / ${totalPoints} remaining`
        case TrackingOptions.FoundOfTotal:
          return `Points: ${currentScore} / ${totalPoints} achieved`
        case TrackingOptions.Remaining:
          return `Remaining points: ${remainingPoints}`
        case TrackingOptions.Found:
          return `Current points: ${currentScore}`
        case TrackingOptions.Total:
          return `Total points: ${totalPoints}`
      }
    }
    return "Total points: hidden"
  }
  return (
    <div>
      {content()}
      <button type="button" className="standard-button" onClick={handleClick}>
        {showTotalPoints ? "Hide" : "Show"}
      </button>
    </div>
  )
}
