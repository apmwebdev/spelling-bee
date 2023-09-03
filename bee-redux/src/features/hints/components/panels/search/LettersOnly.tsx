import { SearchResultProps } from "./Results";
import { getSubstringHintStatusClasses } from "@/features/hints";

export function LettersOnly({
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
