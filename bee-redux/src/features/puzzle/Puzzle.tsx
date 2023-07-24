import Hive from "./Hive";
import { GuessList } from "../guesses/GuessList";
import { GuessInputProvider } from "../../app/GuessInputProvider";
import { GuessInput } from "../guesses/GuessInput";

export function Puzzle() {
  return (
    <GuessInputProvider>
      <div className="sb-controls-container">
        <div className="sb-controls">
          <GuessInput />
          <Hive />
        </div>
        <GuessList />
      </div>
    </GuessInputProvider>
  );
}
