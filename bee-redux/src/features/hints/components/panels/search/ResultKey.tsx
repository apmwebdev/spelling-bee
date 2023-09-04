import { SearchResultProps } from "@/features/hints/components/panels/search/Results";
import {
  SearchPanelLocationOptions,
  StatusTrackingOptions,
  SubstringHintOutputOptions,
} from "@/features/hints";

export function ResultKey({ resultData, statusTracking }: SearchResultProps) {
  const { searchObject } = resultData;
  const { location, lettersOffset, outputType } = searchObject;

  const content = () => {
    return (
      <div className="SearchPanelResultKeyContainer">
        <div className="SearchPanelResultKey">
          <div className="SearchPanelResultKeyItem">
            <header>Location</header>
            <div>{SearchPanelLocationOptions[location].title}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Offset</header>
            <div>{lettersOffset}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Display</header>
            <div>{StatusTrackingOptions[statusTracking].compactTitle}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Output</header>
            <div>{SubstringHintOutputOptions[outputType].title}</div>
          </div>
        </div>
      </div>
    );
  };

  return content();
}
