import { PuzzleNav } from "@/features/puzzle";
import { PuzzleControls } from "@/features/puzzle/components/PuzzleControls";

export function Puzzle() {
  return (
    <div className="Puzzle___threeColumns PuzzleMain_section">
      <PuzzleNav />
      <PuzzleControls />
    </div>
  );
}
