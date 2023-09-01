import { SearchResultProps } from "./SearchPanelResults";
import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
} from "@/features/hints";

export function SearchResultWordCount({
  resultData,
  statusTracking,
}: SearchResultProps) {
  return (
    <div className="SearchResultWordCount">
      Search: {resultData.searchObject.searchString.toUpperCase()}
      <div
        className={getSubstringHintStatusClasses({
          baseClasses: "",
          cell: resultData.total,
          statusTracking,
        })}
      >
        {StatusTrackingOptions[statusTracking].outputFn(resultData.total)}
      </div>
    </div>
  );
}
