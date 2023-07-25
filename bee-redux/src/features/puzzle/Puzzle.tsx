import Hive from "./Hive";
import { GuessList } from "../guesses/GuessList";
import { GuessInputProvider } from "../../app/GuessInputProvider";
import { GuessInput } from "../guesses/GuessInput";
import { GuessInputControls } from "../guesses/guessInput/GuessInputControls";

export function Puzzle() {
  return (
    <GuessInputProvider>
      <div className="sb-controls-container">
        <div className="sb-controls">
          <GuessInput />
          <Hive />
        </div>
        <GuessInputControls />
        <GuessList />
      </div>
    </GuessInputProvider>
  );
}
