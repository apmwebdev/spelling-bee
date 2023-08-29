import * as Popover from "@radix-ui/react-popover";
import { useAppSelector } from "@/app/hooks";
import { selectAnswers, selectPangrams } from "../puzzle/puzzleSlice";
import { Icon } from "@iconify/react";

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
      <Popover.Portal>
        <Popover.Content
          className="PopoverContent"
          side="top"
          avoidCollisions={true}
          collisionPadding={16}
        >
          <span>{completeWord?.definitions[0]}</span>
          <Popover.Close asChild>
            <button type="button" className="popover-close-button">
              <Icon icon="mdi:close-thick"></Icon>
            </button>
          </Popover.Close>
          <Popover.Arrow className="PopoverArrow" width={12} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
