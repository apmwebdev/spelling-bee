import Hive from "./Hive";
import { GuessInputProvider } from "@/app/GuessInputProvider";
import { GuessInput } from "../guesses/GuessInput";
import { GuessInputControls } from "../guesses/guessInput/GuessInputControls";
import { PuzzleNav } from "@/features/puzzle/PuzzleNav";

export function Puzzle() {
  return (
    <GuessInputProvider>
      <div className="sb-controls-container">
        <PuzzleNav />
        <div className="sb-controls">
          <GuessInput />
          <Hive />
        </div>
        <GuessInputControls />
      </div>
    </GuessInputProvider>
  );
}
