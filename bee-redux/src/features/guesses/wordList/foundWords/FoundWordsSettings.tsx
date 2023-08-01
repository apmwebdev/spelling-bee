import {
  selectFoundWordsListSettings,
  setFoundWordsPangramsShowTotal,
  setFoundWordsPerfectPangramsShowTotal,
  setFoundWordsShowPerfectPangrams,
  setFoundWordsWordsShowTotal,
} from "../wordListSettingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/hooks";

export function FoundWordsSettings() {
  const dispatch = useDispatch();
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectFoundWordsListSettings);
  return (
    <div className="sb-word-list-settings-content found">
      <label>
        <input
          type="checkbox"
          checked={wordsShowTotal}
          onChange={(e) =>
            dispatch(setFoundWordsWordsShowTotal(e.target.checked))
          }
        />
        <span>Show total words</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={pangramsShowTotal}
          onChange={(e) =>
            dispatch(setFoundWordsPangramsShowTotal(e.target.checked))
          }
        />
        <span>Show total pangrams</span>
      </label>
      <label>
        <input
          id="sb-found-words-list-show-perfect"
          type="checkbox"
          checked={showPerfectPangrams}
          onChange={(e) =>
            dispatch(setFoundWordsShowPerfectPangrams(e.target.checked))
          }
        />
        <span>Include perfect pangrams</span>
      </label>
      <label>
        <input
          id="sb-found-words-list-perfect-include-total"
          type="checkbox"
          checked={perfectPangramsShowTotal}
          disabled={!showPerfectPangrams}
          onChange={(e) =>
            dispatch(setFoundWordsPerfectPangramsShowTotal(e.target.checked))
          }
        />
        <span className={showPerfectPangrams ? "" : "disabled"}>
          Show total perfect pangrams
        </span>
      </label>
    </div>
  );
}
