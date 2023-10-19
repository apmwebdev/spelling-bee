import { WordLengths } from "./WordLengths";
import { WordCount } from "./WordCount";
import { LettersPresent } from "./LettersPresent";
import { ResultHeader } from "./ResultHeader";
import { ResultKey } from "./ResultKey";
import { SearchResultProps } from "@/features/searchPanelSearches";
import { SubstringHintOutputKeys } from "@/features/hintPanels";

export function Result({ resultData, statusTracking }: SearchResultProps) {
  const content = () => {
    if (resultData.total.answers === 0) {
      return (
        <div>
          "{resultData.searchObject.searchString}" not found in answers with
          given settings
        </div>
      );
    }

    switch (resultData.searchObject.outputType) {
      case SubstringHintOutputKeys.WordLengthGrid:
        return (
          <WordLengths
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
      case SubstringHintOutputKeys.WordCountList:
        return (
          <WordCount resultData={resultData} statusTracking={statusTracking} />
        );
      case SubstringHintOutputKeys.LettersPresent:
        return (
          <LettersPresent
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
    }
  };

  return (
    <div className="SearchPanelResult">
      <ResultHeader searchObject={resultData.searchObject} />
      <ResultKey resultData={resultData} statusTracking={statusTracking} />
      <div className="SearchPanelResultContent">{content()}</div>
    </div>
  );
}