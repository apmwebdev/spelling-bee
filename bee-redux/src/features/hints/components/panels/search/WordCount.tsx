import { SearchResultProps } from "./Results";
import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
} from "@/features/hints";

export function WordCount({
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
