import { FoundWordsSettings } from "./wordList/FoundWordsSettings";
import { FoundWordsStatus } from "./wordList/FoundWordsStatus";
import { WordListTabs } from "./wordList/WordListTabs";

export function WordList() {
  return (
    <div className="sb-word-list-container">
      <h2>Words</h2>
      <WordListTabs />
    </div>
  );
}
