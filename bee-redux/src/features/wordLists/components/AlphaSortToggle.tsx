import { WordListHeaderProps } from "@/features/wordLists/components/WordListHeader";
import { SortType } from "@/features/wordLists";
import { SortOrderKeys } from "@/types/globalTypes";
import { useAppDispatch } from "@/app/hooks";

export function AlphaSortToggle(props: WordListHeaderProps) {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder, setSortType, setSortOrder } = props;
  const getToggleLabel = () => {
    if (
      sortType === SortType.Alphabetical &&
      sortOrder === SortOrderKeys.desc
    ) {
      return "Z → A";
    }
    return "A → Z";
  };

  const handleClick = () => {
    if (sortType === SortType.Alphabetical) {
      if (sortOrder === SortOrderKeys.asc) {
        dispatch(setSortOrder(SortOrderKeys.desc));
      } else {
        dispatch(setSortOrder(SortOrderKeys.asc));
      }
      return;
    }
    if (setSortType) dispatch(setSortType(SortType.Alphabetical));
    if (sortOrder !== SortOrderKeys.asc) {
      dispatch(setSortOrder(SortOrderKeys.asc));
    }
  };

  return (
    <button
      type="button"
      className="ToggleGroupItem"
      onClick={handleClick}
      data-state={sortType === SortType.Alphabetical ? "on" : "off"}
    >
      {getToggleLabel()}
    </button>
  );
}
