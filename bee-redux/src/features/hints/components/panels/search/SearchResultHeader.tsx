import {
  SearchPanelLocationKeys,
  SearchPanelSearch,
  SubstringHintOutputKeys,
} from "@/features/hints";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function SearchResultHeader({
  searchObject,
}: {
  searchObject: SearchPanelSearch;
}) {
  const { searchString, location, lettersOffset, outputType } = searchObject;
  const title = () => {
    const offsetString = () => {
      let returnString = "";
      for (let i = 0; i < lettersOffset; i++) {
        returnString += "-";
      }
      return returnString;
    };

    let titleString = "";

    if (location === SearchPanelLocationKeys.Anywhere) {
      titleString += `...${searchString.toUpperCase()}... `;
    } else if (location === SearchPanelLocationKeys.Start) {
      titleString += `${offsetString()}${searchString.toUpperCase()}... `;
    } else if (location === SearchPanelLocationKeys.End) {
      titleString += `...${searchString.toUpperCase()}${offsetString()} `;
    }

    if (outputType === SubstringHintOutputKeys.WordLengthGrid) {
      titleString += " Word Lengths";
    } else if (outputType === SubstringHintOutputKeys.WordCountList) {
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
    <header className="SearchHintSearchResultHeader">
      <IconButton
        type={IconButtonTypeKeys.Close}
        className="SearchResultHeaderRemoveButton"
        onClick={handleClickRemoveButton}
        tooltip="Delete search"
      />
      <div className="search-result-title">{title()}</div>
    </header>
  );
}
