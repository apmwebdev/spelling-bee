import { FormEvent, useState } from "react";
import { Results } from "./search/Results";
import {
  HintPanelData,
  isSearchPanelData,
  SearchPanelData,
  SearchPanelSearchData,
} from "@/features/hints";
import {
  hintApiSlice,
  useAddSearchMutation,
} from "@/features/hints/hintApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentAttemptId } from "@/features/guesses/guessesSlice";

export function SearchHintPanel({ panel }: { panel: HintPanelData }) {
  const [searchValue, setSearchValue] = useState("");
  const currentAttemptId = useSelector(selectCurrentAttemptId);
  const { data } =
    hintApiSlice.endpoints.getSearches.useQueryState(currentAttemptId);
  const [addSearch] = useAddSearchMutation();
  if (!isSearchPanelData(panel.typeData)) return null;
  //For TypeScript
  const searchPanelData = panel.typeData as SearchPanelData;

  const getPanelSearches = (data: SearchPanelSearchData[] | undefined) => {
    if (!data) return;
    return data.filter((search) => search.searchPanelId === searchPanelData.id);
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
        <button type="submit" className="standard-button">
          Search
        </button>
      </form>
      <Results
        searches={getPanelSearches(data) ?? []}
        tracking={panel.statusTracking}
      />
    </div>
  );
}
