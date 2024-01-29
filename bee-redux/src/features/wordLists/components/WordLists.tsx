/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Tabs from "@/components/radix-ui/radix-tabs";
import { KnownWordsContainer } from "./knownWords/KnownWordsContainer";
import { WrongGuessesContainer } from "./wrongGuesses/WrongGuessesContainer";
import { ExcludedWordsContainer } from "./excludedWords/ExcludedWordsContainer";
import { AnswersContainer } from "./answers/AnswersContainer";

export function WordLists() {
  return (
    <Tabs.Root defaultValue="knownWords">
      <Tabs.List style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <Tabs.Trigger value="knownWords">Known</Tabs.Trigger>
        <Tabs.Trigger value="wrongGuesses">Wrong</Tabs.Trigger>
        <Tabs.Trigger value="excludedWords">Excluded</Tabs.Trigger>
        <Tabs.Trigger value="answers">Answers</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="knownWords">
        <KnownWordsContainer />
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
  );
}
