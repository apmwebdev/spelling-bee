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
  const { searchString, location } = searchObject;

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
      <div className="search-result-title">Search: "{searchString}"</div>
    </header>
  );
}
