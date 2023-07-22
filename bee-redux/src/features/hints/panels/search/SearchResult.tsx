import { SearchResultProps } from "./SearchPanelResults";
import { StringHintDisplayOptions } from "../../hintProfilesSlice";
import { SearchResultWordLengths } from "./SearchResultWordLengths";
import { SearchResultWordCount } from "./SearchResultWordCount";
import { SearchResultLettersOnly } from "./SearchResultLettersOnly";
import { SearchResultHeader } from "./SearchResultHeader";

export function SearchResult({
  panelId,
  resultData,
  tracking,
}: SearchResultProps) {
  const content = () => {
    switch (resultData.searchObject.display) {
      case StringHintDisplayOptions.WordLengthGrid:
        return (
          <SearchResultWordLengths
            resultData={resultData}
            tracking={tracking}
          />
        );
      case StringHintDisplayOptions.WordCountList:
        return (
          <SearchResultWordCount resultData={resultData} tracking={tracking} />
        );
      case StringHintDisplayOptions.LettersOnly:
        return (
          <SearchResultLettersOnly
            resultData={resultData}
            tracking={tracking}
          />
        );
    }
  };

  return (
    <div className="sb-search-panel-result">
      <SearchResultHeader
        panelId={panelId ? panelId : 0}
        searchObject={resultData.searchObject}
      />
      <div className="result-content">{content()}</div>
    </div>
  );
}
