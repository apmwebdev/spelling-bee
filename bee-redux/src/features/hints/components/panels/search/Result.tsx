import { SearchResultProps } from "./Results";
import { WordLengths } from "./WordLengths";
import { WordCount } from "./WordCount";
import { LettersOnly } from "./LettersOnly";
import { ResultHeader } from "./ResultHeader";
import { SubstringHintOutputKeys } from "@/features/hints";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function Result({
  resultData,
  statusTracking,
}: SearchResultProps) {
  const content = () => {
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
          <WordCount
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
      case SubstringHintOutputKeys.LettersList:
        return (
          <LettersOnly
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
    }
  };

  return (
    <div className="SearchPanelResult">
      <ResultHeader searchObject={resultData.searchObject} />
      <div className="result-content">{content()}</div>
    </div>
  );
}
