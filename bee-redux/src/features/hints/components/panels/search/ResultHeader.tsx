import {
  SearchPanelLocationOptions,
  SearchPanelSearchData,
} from "@/features/hints";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function ResultHeader({
  searchObject,
}: {
  searchObject: SearchPanelSearchData;
}) {
  const { searchString, location, lettersOffset, outputType } = searchObject;
  const title = () => {
    let titleString = `Search: "${searchString.toLowerCase()}" (`;
    titleString += `${SearchPanelLocationOptions[location].title.toLowerCase()}`;
    titleString += ", ";
    titleString += `${lettersOffset ? `offset ${lettersOffset}` : "no offset"}`;
    titleString += ")";

    return `"${searchString}"`;
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
