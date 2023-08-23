import { HintPanelProps } from "../HintPanel";
import { FormEvent, useState } from "react";
import { HintPanelSettings } from "../HintPanelSettings";
import { SearchPanelSettings } from "./search/SearchPanelSettings";
import { useDispatch } from "react-redux";
import { random } from "lodash";
import { SearchPanelResults } from "./search/SearchPanelResults";
import { isSearchPanelData } from "@/features/hints";

export function SearchHintPanel({ panel }: HintPanelProps) {
  const dispatch = useDispatch();
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

  const searchSettings = () => <SearchPanelSettings />;
  return (
    <>
      <HintPanelSettings panel={panel} TypeSettingsComponent={searchSettings} />
      <div className="sb-search-hints">
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            className="sb-search-hint-input"
            value={searchValue}
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
    </>
  );
}
