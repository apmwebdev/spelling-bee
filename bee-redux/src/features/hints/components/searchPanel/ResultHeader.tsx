import {
  SearchPanelSearchData,
  useDeleteSearchMutation,
} from "@/features/hints";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function ResultHeader({
  searchObject,
}: {
  searchObject: SearchPanelSearchData;
}) {
  const [deleteSearch] = useDeleteSearchMutation();
  const { searchString } = searchObject;

  const handleClickRemoveButton = () => {
    deleteSearch({ id: searchObject.id, createdAt: searchObject.createdAt });
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
