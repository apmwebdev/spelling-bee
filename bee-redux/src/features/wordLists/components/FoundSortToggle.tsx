import { WordListHeaderProps } from "@/features/wordLists/components/WordListHeader";
import { SortType } from "@/features/wordLists";
import { useAppDispatch } from "@/app/hooks";
import { SortOrderKeys } from "@/types/globalTypes";

export function FoundSortToggle(props: WordListHeaderProps) {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder, setSortType, setSortOrder } = props;
  const getToggleLabel = () => {
    if (sortType === SortType.FoundOrder && sortOrder === SortOrderKeys.desc) {
      return "Last → First";
    }
    return "First → Last";
  };

  const handleClick = () => {
    if (sortType === SortType.FoundOrder) {
      if (sortOrder === SortOrderKeys.asc) {
        dispatch(setSortOrder(SortOrderKeys.desc));
      } else {
        dispatch(setSortOrder(SortOrderKeys.asc));
      }
      return;
    }
    if (setSortType) dispatch(setSortType(SortType.FoundOrder));
    if (sortOrder !== SortOrderKeys.asc) {
      dispatch(setSortOrder(SortOrderKeys.asc));
    }
  };

  return (
    <button
      type="button"
      className="ToggleGroupItem"
      onClick={handleClick}
      data-state={sortType === SortType.FoundOrder ? "on" : "off"}
    >
      {getToggleLabel()}
    </button>
  );
}
