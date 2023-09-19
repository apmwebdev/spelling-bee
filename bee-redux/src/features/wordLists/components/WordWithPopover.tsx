import * as Popover from "@/components/radix-ui/radix-popover";
import { useAppSelector } from "@/app/hooks";
import { selectAnswers, selectPangrams } from "@/features/puzzle";

export function WordWithPopover({ word }: { word: string }) {
  const completeWord = useAppSelector(selectAnswers).find(
    (answer) => answer.word === word,
  );
  const pangrams = useAppSelector(selectPangrams);
  const isPangram = pangrams.includes(word);
  const isPerfect = isPangram && word.length === 7;
  let spanClasses = "has-popover";
  if (isPerfect) {
    spanClasses += " perfect";
  } else if (isPangram) {
    spanClasses += " pangram";
  }
  return (
    <Popover.Root>
      <Popover.Trigger className="word-popover-trigger">
        <span className={spanClasses}>{word}</span>
      </Popover.Trigger>
      <Popover.ContentWithPortal>
        <span>{completeWord?.definitions[0]}</span>
        <Popover.Close />
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
