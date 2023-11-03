import { GuessInputProvider } from "@/features/guesses/providers/GuessInputProvider";
import { GuessInputForm } from "@/features/guesses/components/GuessInputForm";
import { Hive } from "@/features/puzzle";
import { GuessInputControls } from "@/features/guesses";

export function PuzzleControls() {
  return (
    <div className="PuzzleControls">
      <GuessInputProvider>
        <GuessInputForm />
        <Hive />
        <GuessInputControls />
      </GuessInputProvider>
    </div>
  );
}
