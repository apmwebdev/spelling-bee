import { TrackingOptions } from '../../hintProfilesSlice';
import { useAppSelector } from '../../../../app/hooks';
import { selectTotalPoints } from '../../../puzzle/puzzleSlice';
import { selectScore } from '../../../guesses/guessesSlice';

interface TotalPointsProps {
  showTotalPoints: boolean
  tracking: TrackingOptions
}

export function TotalPoints({ showTotalPoints, tracking }: TotalPointsProps) {
  const totalPoints = useAppSelector(selectTotalPoints)
  const currentScore = useAppSelector(selectScore)
  const remainingPoints = totalPoints - currentScore

  const content = () => {
    if (showTotalPoints) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Points: ${remainingPoints} remaining of ${totalPoints}`
        case TrackingOptions.FoundOfTotal:
          return `Points: ${currentScore} of ${totalPoints}`
        case TrackingOptions.Remaining:
          return `Remaining points: ${remainingPoints}`
        case TrackingOptions.Found:
          return `Points: ${currentScore}`
        case TrackingOptions.Total:
          return `Total points: ${totalPoints}`
      }
    }
    return "Total points: hidden"
  }
  return <div>{content()}</div>
}