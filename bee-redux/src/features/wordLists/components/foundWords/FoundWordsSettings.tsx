import {
  selectFoundWordsListSettings,
  setFoundWordsPangramsShowTotal,
  setFoundWordsPerfectPangramsShowTotal,
  setFoundWordsShowPerfectPangrams,
  setFoundWordsWordsShowTotal,
} from "@/features/wordLists";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export function FoundWordsSettings() {
  const dispatch = useAppDispatch();
  const {
    wordsShowTotal,
    pangramsShowTotal,
    showPerfectPangrams,
    perfectPangramsShowTotal,
  } = useAppSelector(selectFoundWordsListSettings);
  return (
    <div className="WordListSettingsContent found">
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
