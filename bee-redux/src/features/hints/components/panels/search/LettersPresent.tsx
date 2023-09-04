import { SearchResultProps } from "./Results";
import { getSubstringHintStatusClasses } from "@/features/hints";

export function LettersPresent({
  resultData,
  statusTracking,
}: SearchResultProps) {
  const present = resultData.total.answers > 0;
  return (
    <div className="SearchResultLettersList">
      <span>Result:</span>
      <div
        className={
          present
            ? getSubstringHintStatusClasses({
                baseClasses: "",
                cell: resultData.total,
                statusTracking,
              })
            : undefined
        }
      >
        {present ? "Present" : "Not present"}
      </div>
    </div>
  );
}
