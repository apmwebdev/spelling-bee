import { Progress } from "@/features/progress";
import { WordLists } from "@/features/wordLists";
import { AttemptControls } from "@/features/guesses";

export function Status() {
  return (
    <div className="Status PuzzleMain_section">
      <Progress />
      <WordLists />
      <AttemptControls />
    </div>
  );
}
