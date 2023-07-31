import * as Popover from "@radix-ui/react-popover";
import { useAppSelector } from "../../../app/hooks";
import { selectAnswers } from "../../puzzle/puzzleSlice";
import { HeaderRemoveButton } from "../../../utils/HeaderRemoveButton";
import { Icon } from "@iconify/react";

export function WordWithPopover({ word }: { word: string }) {
  const completeWord = useAppSelector(selectAnswers).find(
    (answer) => answer.word === word,
  );
  return (
    <li className="has-popover">
      <Popover.Root>
        <Popover.Trigger className="word-popover-trigger">
          {word}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="sb-word-popover-content"
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
            <Popover.Arrow className="popover-arrow" width={12} height={8} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </li>
  );
}
