import { SearchPanelResultSubsectionProps } from "./SearchPanelResults"

export function SearchResultLettersOnly({
  resultData,
  tracking,
}: SearchPanelResultSubsectionProps) {
  return (
    <div>
      <h2>SearchResultLettersOnly</h2>
      search: {resultData.searchObject.searchString}
    </div>
  )
}
