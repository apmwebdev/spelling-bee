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
        <th key={uniqid()} scope="row" className="LetterPanel_WLG_RowHeader">
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
      <table className="LetterPanel_WLG_Table">
        <colgroup>
          <col className="LetterPanel_WLG_HeaderCol" />
          {relevantAnswerLengths.map((_) => (
            <col key={uniqid()} className="LetterPanel_WLG_TdCol" />
          ))}
          <col className="LetterPanel_WLG_TotalCol" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              rowSpan={2}
              className="LetterPanel_WLG_AxisLabel"
            >
              <div>Letters</div>
              <div>↓</div>
            </th>
            <th
              scope="colgroup"
              colSpan={relevantAnswerLengths.length + 1}
              className="LetterPanel_WLG_AxisLabel"
            >
              Word Length →
            </th>
          </tr>
          <tr>
            {relevantAnswerLengths.map((answerLength) => (
              <th scope="col" key={uniqid()}>
                {answerLength}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>{createTableBody()}</tbody>
        <tfoot>
          <tr>
            <th scope="row" className="LetterPanel_WLG_RowHeader">
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
