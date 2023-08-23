import { HeaderRemoveButton } from "@/utils/HeaderRemoveButton";
import { useDispatch } from "react-redux";
import {
  SearchPanelLocations,
  SearchPanelSearch,
  SubstringHintOutputTypes,
} from "@/features/hints";

export function SearchResultHeader({
  panelId,
  searchObject,
}: {
  panelId: number;
  searchObject: SearchPanelSearch;
}) {
  const { id, searchString, location, lettersOffset, outputType } =
    searchObject;
  const dispatch = useDispatch();

  const title = () => {
    const offsetString = () => {
      let returnString = "";
      for (let i = 0; i < lettersOffset; i++) {
        returnString += "-";
      }
      return returnString;
    };

    let titleString = "";

    if (location === SearchPanelLocations.Anywhere) {
      titleString += `...${searchString.toUpperCase()}... `;
    } else if (location === SearchPanelLocations.Start) {
      titleString += `${offsetString()}${searchString.toUpperCase()}... `;
    } else if (location === SearchPanelLocations.End) {
      titleString += `...${searchString.toUpperCase()}${offsetString()} `;
    }

    if (outputType === SubstringHintOutputTypes.WordLengthGrid) {
      titleString += " Word Lengths";
    } else if (outputType === SubstringHintOutputTypes.WordCountList) {
      titleString += " Word Count";
    } else {
      titleString += " Yes or No";
    }
    return titleString;
  };

  const handleClickRemoveButton = () => {
    // dispatch(removeSearch({ panelId, searchId }));
  };

  return (
    <header className="sb-search-hints-search-result-header">
      <HeaderRemoveButton clickHandler={handleClickRemoveButton} />
      <div className="search-result-title">{title()}</div>
    </header>
  );
}
