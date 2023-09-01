import { FormEvent, useState } from "react";
import { SearchPanelResults } from "./search/SearchPanelResults";
import {
  HintPanelData,
  isSearchPanelData,
  SearchPanelSearch,
} from "@/features/hints";
import { hintApiSlice } from "@/features/hints/hintApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentAttemptId } from "@/features/guesses/guessesSlice";

export function SearchHintPanel({ panel }: { panel: HintPanelData }) {
  const [searchValue, setSearchValue] = useState("");
  const currentAttemptId = useSelector(selectCurrentAttemptId);
  const { data } =
    hintApiSlice.endpoints.getSearches.useQueryState(currentAttemptId);
  if (!isSearchPanelData(panel.typeData)) return null;

  const getPanelSearches = (data: SearchPanelSearch[] | undefined) => {
    if (!data) return;
    return data.filter((search) => search.searchPanelId === panel.typeData.id);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // addSearchToPanel();
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
      <SearchPanelResults
        panelId={panel.id}
        searchPanelId={panel.typeData.id}
        searches={getPanelSearches(data) ?? []}
        tracking={panel.statusTracking}
      />
    </div>
  );
}
