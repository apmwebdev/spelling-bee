import {
  changeBasicPanelSubsectionDisplay,
  ChangeBasicPanelSubsectionDisplayPayload,
  TrackingOptions,
} from "../../hintProfilesSlice";
import { useAppSelector } from "../../../../app/hooks";
import { selectPangrams } from "../../../puzzle/puzzleSlice";
import { selectCorrectGuesses } from "../../../guesses/guessesSlice";
import { useDispatch } from "react-redux";

interface PangramCountProps {
  panelId: number;
  showPangramCount: boolean;
  tracking: TrackingOptions;
}

export function PangramCount({
  panelId,
  showPangramCount,
  tracking,
}: PangramCountProps) {
  const dispatch = useDispatch();
  const pangrams = useAppSelector(selectPangrams);
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const totalPangrams = pangrams.length;
  const foundPangrams = correctGuesses.filter((guess) =>
    pangrams.includes(guess.word.toLowerCase()),
  ).length;
  const remainingPangrams = totalPangrams - foundPangrams;

  const handleClick = () => {
    const payload: ChangeBasicPanelSubsectionDisplayPayload = {
      panelId: panelId,
      settingName: "showPangramCount",
      newValue: !showPangramCount,
    };
    dispatch(changeBasicPanelSubsectionDisplay(payload));
  };

  const content = () => {
    if (showPangramCount) {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return `Pangrams: ${remainingPangrams} / ${totalPangrams} remaining`;
        case TrackingOptions.FoundOfTotal:
          return `Pangrams: ${foundPangrams} / ${totalPangrams} found`;
        case TrackingOptions.Remaining:
          return `Remaining pangrams: ${remainingPangrams}`;
        case TrackingOptions.Found:
          return `Found pangrams: ${foundPangrams}`;
        case TrackingOptions.Total:
          return `Total pangrams: ${totalPangrams}`;
      }
    }
    return "Pangrams: hidden";
  };

  return (
    <div>
      {content()}
      <button type="button" className="standard-button" onClick={handleClick}>
        {showPangramCount ? "Hide" : "Show"}
      </button>
    </div>
  );
}
