import * as Popover from "@/components/radix-ui/radix-popover";
import { AnswerFormat } from "@/features/puzzle/puzzleApiSlice";

export function DefinitionPopover({
  answer,
  displayString,
}: {
  answer: AnswerFormat;
  displayString?: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger className="DefinitionPopoverTrigger capitalize">
        {displayString ?? answer.word}
      </Popover.Trigger>
      <Popover.ContentWithPortal>
        <span>{answer.definitions[0]}</span>
      </Popover.ContentWithPortal>
    </Popover.Root>
  );
}
