import { FormEvent, useState } from "react";
import { Results } from "@/features/hints/components/searchPanel/Results";
import { SearchPanelData } from "@/features/hints";
import { useSelector } from "react-redux";
import { selectCurrentAttemptId } from "@/features/guesses";
import { StatusTrackingKeys } from "@/features/hintPanels/types";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addSearch,
  selectSpsByPanel,
} from "@/features/searchPanelSearches/api/searchPanelSearchesSlice";

export function SearchHintPanel({
  searchPanelData,
  statusTracking,
}: {
  searchPanelData: SearchPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const currentAttemptId = useSelector(selectCurrentAttemptId);
  const panelSearches = useAppSelector(selectSpsByPanel(searchPanelData.id));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Add debounce here
    dispatch(
      addSearch({
        searchPanelId: searchPanelData.id,
        attemptId: currentAttemptId,
        searchString: searchValue,
        location: searchPanelData.location,
        lettersOffset: searchPanelData.lettersOffset,
        outputType: searchPanelData.outputType,
        createdAt: Date.now(),
      }),
    );
    setSearchValue("");
  };

  return (
    <div className="SearchHintPanel">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          className="SearchHintInput"
          value={searchValue}
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit" className="standardButton">
          Search
        </button>
      </form>
      <Results searches={panelSearches} tracking={statusTracking} />
    </div>
  );
}
