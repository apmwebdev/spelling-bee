import * as Tabs from "@radix-ui/react-tabs";
import { FoundWordsList } from "./FoundWordsList";
import { WrongGuessesList } from "./WrongGuessesList";
import { ExcludedWordsList } from "./ExcludedWordsList";
import { AnswerList } from "./AnswerList";

export function WordListTabs() {
  return (
    <Tabs.Root className="sb-word-tabs-root" defaultValue="foundWords">
      <Tabs.List className="tabs-list">
        <Tabs.Trigger className="tab-trigger" value="foundWords">
          Found
        </Tabs.Trigger>
        <Tabs.Trigger className="tab-trigger" value="wrongGuesses">
          Wrong
        </Tabs.Trigger>
        <Tabs.Trigger className="tab-trigger" value="excludedWords">
          Excluded
        </Tabs.Trigger>
        <Tabs.Trigger className="tab-trigger" value="answers">
          Answers
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tab-content" value="foundWords">
        <FoundWordsList />
      </Tabs.Content>
      <Tabs.Content className="tab-content" value="wrongGuesses">
        <WrongGuessesList />
      </Tabs.Content>
      <Tabs.Content className="tab-content" value="excludedWords">
        <ExcludedWordsList />
      </Tabs.Content>
      <Tabs.Content className="tab-content" value="answers">
        <AnswerList />
      </Tabs.Content>
    </Tabs.Root>
  );
}
