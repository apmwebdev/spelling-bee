/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { PuzzleControls } from "@/features/puzzle/components/PuzzleControls";
import { AttemptControls } from "@/features/guesses";
import * as Tabs from "@/components/radix-ui/radix-tabs";
import { WordLists } from "@/features/wordLists";
import { PuzzleNav } from "@/features/puzzle";
import { Progress } from "@/features/progress";

export function PuzzleAndStatus() {
  return (
    <div className="PuzzleAndStatusContainer PuzzleMain_section">
      <PuzzleNav />
      <Progress />
      <Tabs.Root defaultValue="puzzle" className="PuzzleSectionTabs">
        <Tabs.List style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Tabs.Trigger value="puzzle">Puzzle</Tabs.Trigger>
          <Tabs.Trigger value="words">Words</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="puzzle">
          <PuzzleControls />
        </Tabs.Content>
        <Tabs.Content value="words">
          <WordLists />
        </Tabs.Content>
      </Tabs.Root>
      <AttemptControls />
    </div>
  );
}
