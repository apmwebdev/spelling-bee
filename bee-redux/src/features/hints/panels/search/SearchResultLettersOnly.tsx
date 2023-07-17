import { SearchResultProps } from "./SearchPanelResults"

export function SearchResultLettersOnly({
  resultData,
  tracking,
}: SearchResultProps) {
  return (
    <div>
      <h2>SearchResultLettersOnly</h2>
      search: {resultData.searchObject.searchString.toUpperCase()}
    </div>
  )
}
