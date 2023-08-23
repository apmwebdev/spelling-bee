import * as Tabs from "@radix-ui/react-tabs";
import { FoundWordsContainer } from "./foundWords/FoundWordsContainer";
import { WrongGuessesContainer } from "./wrongGuesses/WrongGuessesContainer";
import { ExcludedWordsContainer } from "./excludedWords/ExcludedWordsContainer";
import { AnswersContainer } from "./answers/AnswersContainer";

export function WordLists() {
  return (
    <div className="sb-word-list-section-container">
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
