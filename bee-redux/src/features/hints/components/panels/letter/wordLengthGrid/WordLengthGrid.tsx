import { LetterHintDataCell } from "@/features/hints/components/panels/LetterHintPanel";
import { StatusTrackingKeys } from "@/features/hints";
import uniqid from "uniqid";
import { GridData } from "@/features/hints/components/panels/letter/WordLengthGridContainer";
import { WordLengthGridCell } from "@/features/hints/components/panels/letter/wordLengthGrid/WordLengthGridCell";

type WordLengthGridTableProps = GridData & {
  statusTracking: StatusTrackingKeys;
  answerLengths: number[];
};

export function WordLengthGrid({
  gridRows,
  totalRow,
  statusTracking,
  answerLengths,
}: WordLengthGridTableProps) {
  const getTdClasses = (
    cell: LetterHintDataCell,
    isTotalRow: boolean = false,
    isTotalColumn: boolean = false,
  ): string => {
    if (cell.answers === 0 && !isTotalRow && !isTotalColumn) {
      return "sb-wlg-content";
    }
    let returnStr = "";
    if (statusTracking !== "total") {
      if (cell.guesses === cell.answers) {
        returnStr += "hint-completed";
      } else if (cell.guesses === 0) {
        returnStr += "hint-not-started";
      } else {
        returnStr += "hint-in-progress";
      }
    }
    if (!isTotalRow && !isTotalColumn) {
      return returnStr + " sb-wlg-content sb-wlg-content-full";
    }
    if (isTotalRow) {
      returnStr += " sb-wlg-total-row";
    }
    if (isTotalColumn) {
      returnStr += " sb-wlg-total-column";
    }
    return returnStr;
  };

  const createTd = (
    cell: LetterHintDataCell,
    isTotalRow: boolean = false,
    isTotalColumn: boolean = false,
  ) => (
    <WordLengthGridCell
      key={uniqid()}
      cell={cell}
      isTotalRow={isTotalRow}
      isTotalColumn={isTotalColumn}
      statusTracking={statusTracking}
      getTdClasses={getTdClasses}
    />
  );

  const createTableBody = () => {
    const rows = [];
    for (const property in gridRows) {
      const trContent = [];
      trContent.push(
        <th key={uniqid()} scope="row" className="sb-wlg-row-header">
          {property}
        </th>,
      );
      //row content
      for (const cell in gridRows[property]) {
        trContent.push(createTd(gridRows[property][cell]));
      }
      const rowAnswerTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.answers,
        0,
      );
      const rowGuessTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.guesses,
        0,
      );
      trContent.push(
        createTd(
          {
            answers: rowAnswerTotal,
            guesses: rowGuessTotal,
          },
          false,
          true,
        ),
      );
      rows.push(<tr key={uniqid()}>{trContent}</tr>);
    }
    return rows;
  };

  const createTable = () => {
    const answerGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.answers,
      0,
    );
    const guessGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.guesses,
      0,
    );

    return (
      <table className="WordLengthGridTable">
        <colgroup>
          <col className="WlgHeaderCol" />
          {answerLengths.map((_) => (
            <col key={uniqid()} className="WlgTdCol" />
          ))}
          <col className="WlgTotalCol" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              rowSpan={2}
              className="sb-word-length-grid-y-label axis-label"
            >
              <div>Letters</div>
              <div>↓</div>
            </th>
            <th
              scope="colgroup"
              colSpan={answerLengths.length + 1}
              className="sb-word-length-grid-x-label axis-label"
            >
              Word Length →
            </th>
          </tr>
          <tr>
            {answerLengths.map((answerLength) => (
              <th scope="col" key={uniqid()} className="sb-wlg-col-header">
                {answerLength}
              </th>
            ))}
            <th scope="col" className="sb-wlg-col-header">
              Total
            </th>
          </tr>
        </thead>
        <tbody>{createTableBody()}</tbody>
        <tfoot>
          <tr>
            <th scope="row" className="sb-wlg-row-header sb-wlg-total">
              Total
            </th>
            {Object.values(totalRow).map((colTotal) => {
              return createTd(colTotal, true);
            })}
            {createTd(
              {
                answers: answerGrandTotal,
                guesses: guessGrandTotal,
              },
              true,
              true,
            )}
          </tr>
        </tfoot>
      </table>
    );
  };
  return createTable();
}
