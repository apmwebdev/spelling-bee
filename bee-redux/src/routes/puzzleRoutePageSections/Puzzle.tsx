import { Hive, PuzzleNav } from "@/features/puzzle";
import { GuessInputProvider } from "@/features/guesses/providers/GuessInputProvider";
import { GuessInputControls } from "@/features/guesses";
import { GuessInputForm } from "@/features/guesses/components/GuessInputForm";

export function Puzzle() {
  return (
    <GuessInputProvider>
      <div className="PuzzleControlsContainer">
        <PuzzleNav />
        <div className="PuzzleControls">
          <GuessInputForm />
          <Hive />
        </div>
        <GuessInputControls />
      </div>
    </GuessInputProvider>
  );
}
