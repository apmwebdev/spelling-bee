import { GuessInputBackspace } from "./controls/GuessInputBackspace";
import { GuessInputEnter } from "./controls/GuessInputEnter";

export function GuessInputControls() {
  return (
    <div className="GuessInputControls">
      <GuessInputBackspace />
      <div>blah</div>
      <GuessInputEnter />
    </div>
  );
}
