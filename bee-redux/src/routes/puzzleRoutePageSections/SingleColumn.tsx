import * as Tabs from "@/components/radix-ui/radix-tabs";
import { PuzzleControls } from "@/features/puzzle/components/PuzzleControls";
import { WordLists } from "@/features/wordLists";
import { Hints } from "@/routes/puzzleRoutePageSections/Hints";
import { AttemptControls } from "@/features/guesses";
import { PuzzleNav } from "@/features/puzzle";
import { Progress } from "@/features/progress";

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
