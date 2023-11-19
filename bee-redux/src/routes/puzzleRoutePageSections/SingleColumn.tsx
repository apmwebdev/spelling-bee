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
import { PuzzleControls } from "@/features/puzzle/components/PuzzleControls";
import { WordLists } from "@/features/wordLists";
import { Hints } from "@/routes/puzzleRoutePageSections/Hints";
import { PuzzleNav } from "@/features/puzzle";
import { Progress } from "@/features/progress";
import { AttemptControls } from "@/features/guesses";

export function SingleColumn() {
  return (
    <div className="PuzzleMain_section">
      <PuzzleNav />
      <Progress />
      <Tabs.Root defaultValue="puzzle" className="PuzzleSectionTabs">
        <Tabs.List style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Tabs.Trigger value="puzzle">Puzzle</Tabs.Trigger>
          <Tabs.Trigger value="words">Words</Tabs.Trigger>
          <Tabs.Trigger value="hints">Hints</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="puzzle">
          <PuzzleControls />
        </Tabs.Content>
        <Tabs.Content value="words">
          <WordLists />
        </Tabs.Content>
        <Tabs.Content value="hints">
          <Hints />
        </Tabs.Content>
      </Tabs.Root>
      <AttemptControls />
    </div>
  );
}
