import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAttempts,
  selectCurrentAttempt,
  setCurrentAttempt,
} from "../guessesSlice";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";

export function AttemptSelector() {
  const dispatch = useAppDispatch();
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const attempts = useAppSelector(selectAttempts);
  return (
    <Select.Root
      value={`${currentAttempt.id}`}
      onValueChange={(value) => dispatch(setCurrentAttempt(Number(value)))}
    >
      <SelectTrigger />
      <SelectContentWithPortal className="SelectContent">
        <Select.Viewport>
          {attempts.map((attempt, i) => {
            return (
              <SelectItem
                key={uniqid()}
                value={`${attempt.id}`}
                itemText={`Attempt ${i + 1}`}
              />
            );
          })}
        </Select.Viewport>
      </SelectContentWithPortal>
    </Select.Root>
  );
}
