import * as Tabs from "@/components/radix-ui/radix-tabs";
import { FoundWordsContainer } from "./foundWords/FoundWordsContainer";
import { WrongGuessesContainer } from "./wrongGuesses/WrongGuessesContainer";
import { ExcludedWordsContainer } from "./excludedWords/ExcludedWordsContainer";
import { AnswersContainer } from "./answers/AnswersContainer";

export function WordLists() {
  return (
    <div className="sb-word-list-section-container">
      <Tabs.Root defaultValue="foundWords">
        <Tabs.List style={{ gridTemplateColumns: "repeat(4, 1fr" }}>
          <Tabs.Trigger value="foundWords">Found</Tabs.Trigger>
          <Tabs.Trigger value="wrongGuesses">Wrong</Tabs.Trigger>
          <Tabs.Trigger value="excludedWords">Excluded</Tabs.Trigger>
          <Tabs.Trigger value="answers">Answers</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="foundWords">
          <FoundWordsContainer />
        </Tabs.Content>
        <Tabs.Content value="wrongGuesses">
          <WrongGuessesContainer />
        </Tabs.Content>
        <Tabs.Content value="excludedWords">
          <ExcludedWordsContainer />
        </Tabs.Content>
        <Tabs.Content value="answers">
          <AnswersContainer />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
