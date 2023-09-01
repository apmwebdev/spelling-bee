import { StatusTrackingKeys, SubstringHintDataCell } from "@/features/hints";
import uniqid from "uniqid";
import { WordLengthGridCell } from "@/features/hints/components/panels/letter/wordLengthGrid/WordLengthGridCell";
import { GridData } from "@/features/hints/components/panels/letter/types";

type WordLengthGridTableProps = GridData & {
  statusTracking: StatusTrackingKeys;
  showKnown: boolean;
};

export function WordLengthGrid({
  gridRows,
  totalColumn,
  totalRow,
  grandTotal,
  statusTracking,
  relevantAnswerLengths,
}: WordLengthGridTableProps) {
  const createTd = (
    cell: SubstringHintDataCell,
    isTotalRow: boolean = false,
    isTotalColumn: boolean = false,
  ) => (
    <WordLengthGridCell
      key={uniqid()}
      cell={cell}
      isTotalRow={isTotalRow}
      isTotalColumn={isTotalColumn}
      statusTracking={statusTracking}
    />
  );

  const createTableBody = () => {
    const rows = [];
    for (const property in gridRows) {
      const trContent = [];
      //Row header
      trContent.push(
        <th key={uniqid()} scope="row" className="sb-wlg-row-header">
          {property}
        </th>,
      );
      //Row content
      for (const cell in gridRows[property]) {
        trContent.push(createTd(gridRows[property][cell]));
      }
      //Row total
      trContent.push(createTd(totalColumn[property], false, true));
      rows.push(<tr key={uniqid()}>{trContent}</tr>);
    }
    return rows;
  };

  const createTable = () => {
    return (
      <table className="WordLengthGridTable">
        <colgroup>
          <col className="WlgHeaderCol" />
          {relevantAnswerLengths.map((_) => (
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
              colSpan={relevantAnswerLengths.length + 1}
              className="sb-word-length-grid-x-label axis-label"
            >
              Word Length →
            </th>
          </tr>
          <tr>
            {relevantAnswerLengths.map((answerLength) => (
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
            {createTd(grandTotal, true, true)}
          </tr>
        </tfoot>
      </table>
    );
  };
  return createTable();
}
