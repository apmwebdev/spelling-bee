import { FormEvent, useState } from "react";
import { Results } from "@/features/hints/components/searchPanel/Results";
import {
  hintApiSlice,
  SearchPanelData,
  SearchPanelSearchData,
  StatusTrackingKeys,
  useAddSearchMutation,
} from "@/features/hints";
import { useSelector } from "react-redux";
import { selectCurrentAttemptId } from "@/features/guesses";

export function SearchHintPanel({
  searchPanelData,
  statusTracking,
}: {
  searchPanelData: SearchPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const [searchValue, setSearchValue] = useState("");
  const currentAttemptId = useSelector(selectCurrentAttemptId);
  const { data } =
    hintApiSlice.endpoints.getSearches.useQueryState(currentAttemptId);
  const [addSearch] = useAddSearchMutation();

  const getPanelSearches = (data: SearchPanelSearchData[] | undefined) => {
    if (!data) return;
    return data
      .filter((search) => search.searchPanelId === searchPanelData.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Add debounce here
    addSearch({
      searchPanelId: searchPanelData.id,
      attemptId: currentAttemptId,
      searchString: searchValue,
      location: searchPanelData.location,
      lettersOffset: searchPanelData.lettersOffset,
      outputType: searchPanelData.outputType,
      createdAt: Date.now(),
    });
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
      <Results
        searches={getPanelSearches(data) ?? []}
        tracking={statusTracking}
      />
    </div>
  );
}
