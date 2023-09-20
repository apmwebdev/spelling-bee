import { GuessInputBackspace } from "./controls/GuessInputBackspace";
import { GuessInputEnter } from "./controls/GuessInputEnter";
import { ShuffleButton } from "@/features/guesses/components/guessInput/controls/ShuffleButton";

export function GuessInputControls() {
  return (
    <div className="GuessInputControls">
      <GuessInputBackspace />
      <ShuffleButton />
      <GuessInputEnter />
    </div>
  );
}
