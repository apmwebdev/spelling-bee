import { ObscurityPanelData, StatusTrackingKeys } from "@/features/hints";
import { useAppSelector } from "@/app/hooks";
import { selectAnswers } from "@/features/puzzle/puzzleSlice";
import { selectKnownWords } from "@/features/guesses/guessesSlice";
import { AnswerFormat } from "@/features/puzzle/puzzleApiSlice";

export function ObscurityHintPanel({
  obscurityPanelData,
  statusTracking,
}: {
  obscurityPanelData: ObscurityPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const answers = [...useAppSelector(selectAnswers)].sort(
    (a, b) => b.frequency - a.frequency,
  );
  const knownWords = useAppSelector(selectKnownWords);

  const content = (answers: AnswerFormat[], knownWords: string[]) => {
    return answers.map((answer) => {
      if (knownWords.includes(answer.word)) {
        return (
          <tr className="capitalize" key={answer.word}>
            <td>{answer.word}</td>
            <td>{answer.frequency}</td>
          </tr>
        );
      }
      return (
        <tr className="HintNotStarted capitalize" key={answer.word}>
          <td>
            {answer.word.slice(0, obscurityPanelData.revealedLetters)}...{" "}
            {obscurityPanelData.revealLength ? answer.word.length : null}
          </td>
          <td>{answer.frequency}</td>
        </tr>
      );
    });
  };

  return (
    <div className="ObscurityHintPanel">
      <table className="ObscurityPanelTable">
        <thead>
          <tr>
            <th>Word</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>{content(answers, knownWords)}</tbody>
      </table>
    </div>
  );
}
