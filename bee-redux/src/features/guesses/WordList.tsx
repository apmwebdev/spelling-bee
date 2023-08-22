import * as Tabs from "@radix-ui/react-tabs";
import { FoundWordsContainer } from "./wordList/foundWords/FoundWordsContainer";
import { WrongGuessesContainer } from "./wordList/wrongGuesses/WrongGuessesContainer";
import { ExcludedWordsContainer } from "./wordList/excludedWords/ExcludedWordsContainer";
import { AnswersContainer } from "./wordList/answers/AnswersContainer";

export function WordList() {
  return (
    <div className="sb-word-list-section-container">
      {/*<WordListTabs />*/}
      <Tabs.Root className="sb-word-tabs-root" defaultValue="foundWords">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="foundWords">
            Found
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="wrongGuesses">
            Wrong
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="excludedWords">
            Excluded
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="answers">
            Answers
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="foundWords">
          <FoundWordsContainer />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="wrongGuesses">
          <WrongGuessesContainer />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="excludedWords">
          <ExcludedWordsContainer />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="answers">
          <AnswersContainer />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
