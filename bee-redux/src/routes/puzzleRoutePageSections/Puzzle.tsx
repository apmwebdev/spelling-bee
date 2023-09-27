import { Hive, PuzzleNav } from "@/features/puzzle";
import { GuessInputProvider } from "@/app/GuessInputProvider";
import { GuessInput, GuessInputControls } from "@/features/guesses";

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
