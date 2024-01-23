import { SortType } from "@/features/wordLists/api/wordListSettingsSlice";
import { SortOrderKeys } from "@/types/globalTypes";
import { WordListHeader } from "@/features/wordLists/components/WordListHeader";
import { WordListScroller } from "@/features/wordLists/components/WordListScroller";

export function WordListContainer({
  wordList,
  sortType,
  sortOrder,
  setSortType,
  setSortOrder,
  emptyListMessage,
  allowPopovers,
  useSpoilers,
}: {
  wordList: string[];
  sortType: SortType;
  sortOrder: SortOrderKeys;
  setSortType?: Function;
  setSortOrder: Function;
  emptyListMessage: string;
  allowPopovers: boolean;
  useSpoilers?: boolean;
}) {
  if (wordList.length === 0) {
    return <div className="WordList empty">{emptyListMessage}</div>;
  }
  return (
    <div className="WordListContainer">
      <WordListHeader
        sortType={sortType}
        sortOrder={sortOrder}
        setSortType={setSortType}
        setSortOrder={setSortOrder}
      />
      <WordListScroller
        wordList={wordList}
        allowPopovers={allowPopovers}
        useSpoilers={useSpoilers}
      />
    </div>
  );
}
