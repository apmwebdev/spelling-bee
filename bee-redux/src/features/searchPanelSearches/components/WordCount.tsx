import { getSubstringHintStatusClasses } from "@/features/hints";
import { StatusTrackingOptions } from "@/features/hintPanels/types";
import { SearchResultProps } from "@/features/searchPanelSearches/types";

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
