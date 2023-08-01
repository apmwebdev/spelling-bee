import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectAnswersListSettings,
  setAnswersRemainingAndSpoiledOnly,
  setAnswersRemainingGroupWithLetter,
  setAnswersRemainingLocation,
  setAnswersRemainingRevealFirstLetter,
  setAnswersRemainingRevealLength,
} from "../wordListSettingsSlice";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

export function AnswersSettings() {
  const dispatch = useAppDispatch();
  const {
    remainingAndSpoiledOnly,
    remainingRevealFirstLetter,
    remainingRevealLength,
    remainingLocation,
    remainingGroupWithLetter,
  } = useAppSelector(selectAnswersListSettings);
  return (
    <div className="sb-word-list-settings-content answers">
      <label>
        <input
          type="checkbox"
          checked={remainingAndSpoiledOnly}
          onChange={(e) =>
            dispatch(setAnswersRemainingAndSpoiledOnly(e.target.checked))
          }
        />
        <span>Show spoiled and unrevealed answers only</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingRevealFirstLetter}
          onChange={(e) =>
            dispatch(setAnswersRemainingRevealFirstLetter(e.target.checked))
          }
        />
        <span>Show first letter of unrevealed answers</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingRevealLength}
          onChange={(e) =>
            dispatch(setAnswersRemainingRevealLength(e.target.checked))
          }
        />
        <span>Show length of unrevealed answers</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={remainingGroupWithLetter}
          disabled={!remainingRevealFirstLetter}
          onChange={(e) =>
            dispatch(setAnswersRemainingGroupWithLetter(e.target.checked))
          }
        />
        <span className={remainingRevealFirstLetter ? "" : "disabled"}>
          Group unrevealed answers by first letter
        </span>
      </label>
      <div>
        <ToggleGroup.Root
          type="single"
          className="sb-word-list-toggle"
          value={remainingLocation}
          onValueChange={(val) => dispatch(setAnswersRemainingLocation(val))}
        >
          <ToggleGroup.Item value="beginning">Beginning</ToggleGroup.Item>
          <ToggleGroup.Item value="end">End</ToggleGroup.Item>
        </ToggleGroup.Root>
        <span>Show remaining answers at the {remainingLocation}</span>
      </div>
    </div>
  );
}
