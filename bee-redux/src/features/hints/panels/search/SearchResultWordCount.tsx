import { SearchPanelResultSubsectionProps } from "./SearchPanelResults"

export function SearchResultWordCount({
  resultData,
  tracking,
}: SearchPanelResultSubsectionProps) {
  return (
    <div>
      <h2>SearchResultWordCount</h2>
      search: {resultData.searchObject.searchString}
    </div>
  )
}
