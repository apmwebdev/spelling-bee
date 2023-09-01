import { SearchResultProps } from "./SearchPanelResults";
import { SearchResultWordLengths } from "./SearchResultWordLengths";
import { SearchResultWordCount } from "./SearchResultWordCount";
import { SearchResultLettersOnly } from "./SearchResultLettersOnly";
import { SearchResultHeader } from "./SearchResultHeader";
import { SubstringHintOutputKeys } from "@/features/hints";

export function SearchResult({
  resultData,
  statusTracking,
}: SearchResultProps) {
  const content = () => {
    switch (resultData.searchObject.outputType) {
      case SubstringHintOutputKeys.WordLengthGrid:
        return (
          <SearchResultWordLengths
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
      case SubstringHintOutputKeys.WordCountList:
        return (
          <SearchResultWordCount
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
      case SubstringHintOutputKeys.LettersList:
        return (
          <SearchResultLettersOnly
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
    }
  };

  return (
    <div className="SearchPanelResult">
      <SearchResultHeader searchObject={resultData.searchObject} />
      <div className="result-content">{content()}</div>
    </div>
  );
}
