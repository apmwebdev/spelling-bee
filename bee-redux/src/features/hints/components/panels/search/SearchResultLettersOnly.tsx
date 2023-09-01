import { SearchResultProps } from "./SearchPanelResults";
import { getSubstringHintStatusClasses, StatusTrackingOptions } from "@/features/hints";

export function SearchResultLettersOnly({
  resultData,
  statusTracking,
}: SearchResultProps) {
  return (
    <div className="SearchResultLettersList">
      search: {resultData.searchObject.searchString.toUpperCase()}
      <div
        className={getSubstringHintStatusClasses({
          baseClasses: "",
          cell: resultData.total,
          statusTracking,
        })}
      >
        "{resultData.searchObject.searchString.toLowerCase()}"
      </div>
    </div>
  );
}
