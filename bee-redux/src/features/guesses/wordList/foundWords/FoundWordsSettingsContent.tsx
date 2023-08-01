import {
  selectFoundWordsListSettings,
  setFoundWordsIncludeTotal,
  setIncludePerfectPangrams,
  setPangramsIncludeTotal,
  setPerfectPangramsIncludeTotal,
} from "../wordListSettingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/hooks";

export function FoundWordsSettingsContent() {
  const dispatch = useDispatch();
  const {
    foundWordsIncludeTotal,
    pangramsIncludeTotal,
    includePerfectPangrams,
    perfectPangramsIncludeTotal,
  } = useAppSelector(selectFoundWordsListSettings);
  return (
    <div className="sb-word-list-settings-content found">
      <label>
        <input
          type="checkbox"
          checked={foundWordsIncludeTotal}
          onChange={(e) =>
            dispatch(setFoundWordsIncludeTotal(e.target.checked))
          }
        />
        <span>Show total words</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={pangramsIncludeTotal}
          onChange={(e) => dispatch(setPangramsIncludeTotal(e.target.checked))}
        />
        <span>Show total pangrams</span>
      </label>
      <label>
        <input
          id="sb-found-words-list-show-perfect"
          type="checkbox"
          checked={includePerfectPangrams}
          onChange={(e) =>
            dispatch(setIncludePerfectPangrams(e.target.checked))
          }
        />
        <span>Include perfect pangrams</span>
      </label>
      <label>
        <input
          id="sb-found-words-list-perfect-include-total"
          type="checkbox"
          checked={perfectPangramsIncludeTotal}
          disabled={!includePerfectPangrams}
          onChange={(e) =>
            dispatch(setPerfectPangramsIncludeTotal(e.target.checked))
          }
        />
        <span className={includePerfectPangrams ? "" : "disabled"}>
          Show total perfect pangrams
        </span>
      </label>
    </div>
  );
}
