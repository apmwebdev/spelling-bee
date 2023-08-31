import { useDispatch } from "react-redux";
import {
  SearchPanelLocationKeys,
  SearchPanelSearch,
  SubstringHintOutputKeys,
} from "@/features/hints";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

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
    <header className="sb-search-hints-search-result-header">
      <IconButton
        type={IconButtonTypeKeys.Close}
        className="header-remove-button"
        onClick={handleClickRemoveButton}
        tooltip="Delete search"
      />
      <div className="search-result-title">{title()}</div>
    </header>
  );
}
