import { Hive } from "./Hive";
import { GuessInputProvider } from "@/app/GuessInputProvider";
import { GuessInput, GuessInputControls } from "@/features/guesses";
import { PuzzleNav } from "@/features/puzzle/components/PuzzleNav";

export function Puzzle() {
  return (
    <GuessInputProvider>
      <div className="PuzzleControlsContainer">
        <PuzzleNav />
        <div className="PuzzleControls">
          <GuessInput />
          <Hive />
        </div>
        <GuessInputControls />
      </div>
    </GuessInputProvider>
  );
}
