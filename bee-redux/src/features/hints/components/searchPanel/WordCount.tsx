import { SearchResultProps } from "./Results";
import { getSubstringHintStatusClasses } from "@/features/hints";
import { StatusTrackingOptions } from "@/features/hintPanels/types";

export function WordCount({ resultData, statusTracking }: SearchResultProps) {
  return (
    <div className="SearchResultWordCount">
      <span>Result:</span>
      <div
        className={getSubstringHintStatusClasses({
          baseClasses: "SearchHintResult_WC_Result",
          cell: resultData.total,
          statusTracking,
        })}
      >
        {StatusTrackingOptions[statusTracking].outputFn(resultData.total)}
      </div>
    </div>
  );
}
