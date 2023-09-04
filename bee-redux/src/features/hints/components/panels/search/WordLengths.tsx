import { SearchResultProps } from "./Results";
import uniqid from "uniqid";
import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
  SubstringHintDataCell,
} from "@/features/hints";

export function WordLengths({ resultData, statusTracking }: SearchResultProps) {
  const content = () => {
    const getCellClasses = (dataCell: SubstringHintDataCell) => {
      let classList = "ContentCell";
      if (dataCell.answers === 0) {
        return classList;
      }
      classList += " HasContent";
      return getSubstringHintStatusClasses({
        baseClasses: classList,
        cell: dataCell,
        statusTracking: statusTracking,
      });
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
        <td className={cssClasses} key={uniqid()}>
          {cellText}
        </td>
      );
    };

    const headerRowDivs = [];
    headerRowDivs.push(
      <th scope="row" className="HeaderCell RowHeader" key={uniqid()}>
        Word Length
      </th>,
    );
    const contentRowDivs = [];
    contentRowDivs.push(
      <th scope="row" className="ContentCell RowHeader" key={uniqid()}>
        Results
      </th>,
    );
    for (const lengthProp in resultData.results) {
      headerRowDivs.push(
        <th scope="col" className="HeaderCell" key={uniqid()}>
          {lengthProp}
        </th>,
      );
      contentRowDivs.push(createCell(resultData.results[lengthProp]));
    }
    headerRowDivs.push(
      <th scope="col" className="HeaderCell" key={uniqid()}>
        Total
      </th>,
    );
    contentRowDivs.push(createCell(resultData.total));

    const headerRow = <tr className="HeaderRow">{headerRowDivs}</tr>;
    const contentRow = <tr className="ContentRow">{contentRowDivs}</tr>;

    return (
      <table className="SearchHintResult_WordLengthGrid">
        <colgroup>
          <col />
          {Object.keys(resultData.results).map((_) => (
            <col key={uniqid()} className="SearchHintResult_WLG_TdCol" />
          ))}
          <col className="SearchHintResult_WLG_TotalCol" />
        </colgroup>
        <thead>{headerRow}</thead>
        <tbody>{contentRow}</tbody>
      </table>
    );
  };

  return <div>{content()}</div>;
}
