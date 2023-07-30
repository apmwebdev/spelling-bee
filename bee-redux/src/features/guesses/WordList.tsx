import { WordListSettings } from "./wordList/WordListSettings";
import { WordListStatus } from "./wordList/WordListStatus";
import { WordListTabs } from "./wordList/WordListTabs";

export function WordList() {
  return (
    <div className="sb-guess-list-container">
      <WordListSettings />
      <WordListStatus />
      <WordListTabs />
    </div>
  );
}
