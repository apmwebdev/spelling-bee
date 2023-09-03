import { SearchResultProps } from "./Results";
import uniqid from "uniqid";
import { StatusTrackingOptions, SubstringHintDataCell } from "@/features/hints";

export function WordLengths({
  resultData,
  statusTracking,
}: SearchResultProps) {
  const generateOutput = () => {
    const getCellClasses = (dataCell: SubstringHintDataCell) => {
      let classList = "content-cell";
      if (dataCell.answers === 0) {
        return classList;
      }
      classList += " has-content";
      if (statusTracking !== "total") {
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

    const createCell = (dataCell: SubstringHintDataCell) => {
      const cssClasses = getCellClasses(dataCell);
      let cellText = "";
      if (dataCell.answers === 0) {
        cellText = "-";
      } else {
        cellText = StatusTrackingOptions[statusTracking].outputFn(dataCell);
      }
      return (
        <div className={cssClasses} key={uniqid()}>
          {cellText}
        </div>
      );
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
        {StatusTrackingOptions[statusTracking].compactTitle}
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
    headerRowDivs.push(
      <div className="header-cell" key={uniqid()}>
        Total
      </div>,
    );
    contentRowDivs.push(createCell(resultData.total));

    const headerRow = <div className="header-row">{headerRowDivs}</div>;
    const contentRow = <div className="content-row">{contentRowDivs}</div>;

    return (
      <div className="SearchHintResultWordLengthGrid">
        {headerRow}
        {contentRow}
        <div>Excluded words: {resultData.excludedAnswers}</div>
      </div>
    );
  };

  return <div>{generateOutput()}</div>;
}
