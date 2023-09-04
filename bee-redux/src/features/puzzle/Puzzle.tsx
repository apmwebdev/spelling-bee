import Hive from "./Hive";
import { GuessInputProvider } from "@/app/GuessInputProvider";
import { GuessInput } from "../guesses/GuessInput";
import { GuessInputControls } from "../guesses/guessInput/GuessInputControls";
import { PuzzleNav } from "@/features/puzzle/PuzzleNav";
import "@/styles/puzzle.scss";

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
