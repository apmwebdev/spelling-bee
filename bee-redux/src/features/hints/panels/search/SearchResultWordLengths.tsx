import { SearchResultProps } from "./SearchPanelResults";
import { LetterHintDataCell } from "../LetterHintPanel";
import { TrackingOptions } from "../../hintProfilesSlice";
import uniqid from "uniqid";

export function SearchResultWordLengths({
  resultData,
  tracking,
}: SearchResultProps) {
  const generateOutput = () => {
    const getCellClasses = (dataCell: LetterHintDataCell) => {
      let classList = "content-cell";
      if (dataCell.answers === 0) {
        return classList;
      }
      classList += " has-content";
      if (tracking !== TrackingOptions.Total) {
        if (dataCell.guesses === dataCell.answers) {
          classList += " hint-completed";
        } else if (dataCell.guesses === 0) {
          classList += " hint-not-started";
        } else {
          classList += " hint-in-progress";
        }
      }
      return classList;
    };

    const createCell = (dataCell: LetterHintDataCell) => {
      const cssClasses = getCellClasses(dataCell);
      const total = dataCell.answers;
      const found = dataCell.guesses;
      const remaining = found - total;
      let cellText = "";
      if (total === 0) {
        cellText = "-";
      } else {
        switch (tracking) {
          case TrackingOptions.RemainingOfTotal:
            cellText = `${remaining}/${total}`;
            break;
          case TrackingOptions.FoundOfTotal:
            cellText = `${found}/${total}`;
            break;
          case TrackingOptions.Remaining:
            cellText = "" + remaining;
            break;
          case TrackingOptions.Found:
            cellText = "" + found;
            break;
          case TrackingOptions.Total:
            cellText = "" + total;
        }
      }
      return (
        <div className={cssClasses} key={uniqid()}>
          {cellText}
        </div>
      );
    };

    const contentRowHeaderText = () => {
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          return "Remaining / Total";
        case TrackingOptions.FoundOfTotal:
          return "Found / Total";
        case TrackingOptions.Remaining:
          return "Remaining";
        case TrackingOptions.Found:
          return "Found";
        case TrackingOptions.Total:
          return "Total";
      }
    };

    const headerRowDivs = [];
    headerRowDivs.push(
      <div className="header-cell row-header" key={uniqid()}>
        Word Length
      </div>,
    );
    const contentRowDivs = [];
    contentRowDivs.push(
      <div className="content-cell row-header" key={uniqid()}>
        {contentRowHeaderText()}
      </div>,
    );
    for (const lengthProp in resultData.results) {
      headerRowDivs.push(
        <div className="header-cell" key={uniqid()}>
          {lengthProp}
        </div>,
      );
      contentRowDivs.push(createCell(resultData.results[lengthProp]));
    }

    const headerRow = <div className="header-row">{headerRowDivs}</div>;
    const contentRow = <div className="content-row">{contentRowDivs}</div>;

    return (
      <div className="sb-search-hints-result-wlg">
        {headerRow}
        {contentRow}
      </div>
    );
  };

  return <div>{generateOutput()}</div>;
}
