import { SearchPanelResultSubsectionProps } from "./SearchPanelResults"

export function SearchResultWordLengths({
  resultData,
  tracking,
}: SearchPanelResultSubsectionProps) {
  return (
    <div>
      <h2>SearchResultWordLengths</h2>
      search: {resultData.searchObject.searchString}
    </div>
  )
}
