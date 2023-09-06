import { ObscurityPanelData, StatusTrackingKeys } from "@/features/hints";
import { useAppSelector } from "@/app/hooks";
import { selectAnswers } from "@/features/puzzle/puzzleSlice";
import { selectKnownWords } from "@/features/guesses/guessesSlice";

export function ObscurityHintPanel({
  obscurityPanelData,
  statusTracking,
}: {
  obscurityPanelData: ObscurityPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const answers = [...useAppSelector(selectAnswers)]
    .sort((a, b) => b.frequency - a.frequency);
  const knownWords = useAppSelector(selectKnownWords);
  return <div className="ObscurityHintPanel">Obscurity panel</div>;
}
