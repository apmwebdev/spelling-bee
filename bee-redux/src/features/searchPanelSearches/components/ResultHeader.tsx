import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import {
  deleteSearch,
  SearchPanelSearchData,
} from "@/features/searchPanelSearches";
import { useAppDispatch } from "@/app/hooks";

export function ResultHeader({
  searchObject,
}: {
  searchObject: SearchPanelSearchData;
}) {
  const dispatch = useAppDispatch();
  const { searchString } = searchObject;

  const handleClickRemoveButton = () => {
    dispatch(
      deleteSearch({ id: searchObject.id, createdAt: searchObject.createdAt }),
    );
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
