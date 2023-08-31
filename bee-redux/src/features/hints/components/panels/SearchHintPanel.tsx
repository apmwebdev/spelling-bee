import { FormEvent, useState } from "react";
import { SearchPanelResults } from "./search/SearchPanelResults";
import { HintPanelData, isSearchPanelData } from "@/features/hints";

export function SearchHintPanel({ panel }: { panel: HintPanelData }) {
  const [searchValue, setSearchValue] = useState("");

  // const addSearchToPanel = () => {
  //   if (!isSearchPanelData(panel.typeData)) {
  //     return;
  //   }
  //   const { location, lettersOffset, outputType } =
  //     panel.typeData;
  //   const payload = {
  //     panelId: panel.id,
  //     search: {
  //       searchId: random(1000),
  //       searchString: searchValue,
  //       location,
  //       lettersOffset,
  //       outputType,
  //     },
  //   };
  //   dispatch(addSearch(payload));
  // };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // addSearchToPanel();
  };

  const searches = () => {
    if (!isSearchPanelData(panel.typeData)) {
      return [];
    }
    // return panel.typeData.searches;
    return [];
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
        results={searches()}
        tracking={panel.statusTracking}
      />
    </div>
  );
}
