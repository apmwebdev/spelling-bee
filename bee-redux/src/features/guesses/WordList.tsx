import { FoundWordsSettings } from "./wordList/foundWords/FoundWordsSettings";
import { FoundWordsStatus } from "./wordList/foundWords/FoundWordsStatus";
import { WordListTabs } from "./wordList/WordListTabs";

export function WordList() {
  return (
    <div className="sb-word-list-section-container">
      <h2>Words</h2>
      <WordListTabs />
    </div>
  );
}
