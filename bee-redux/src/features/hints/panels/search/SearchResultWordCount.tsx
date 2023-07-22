import { SearchResultProps } from "./SearchPanelResults";

export function SearchResultWordCount({
  resultData,
  tracking,
}: SearchResultProps) {
  return (
    <div>
      <h2>SearchResultWordCount</h2>
      search: {resultData.searchObject.searchString.toUpperCase()}
    </div>
  );
}
