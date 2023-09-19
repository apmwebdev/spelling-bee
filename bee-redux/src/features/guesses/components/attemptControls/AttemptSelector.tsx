import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectAttempts,
  selectCurrentAttempt,
  setCurrentAttempt,
} from "@/features/guesses";
import * as Select from "@/components/radix-ui/radix-select";
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
      <Select.Trigger />
      <Select.ContentWithPortal className="SelectContent">
        <Select.Viewport>
          {attempts.map((attempt, i) => {
            return (
              <Select.Item
                key={uniqid()}
                value={`${attempt.id}`}
                itemText={`Attempt ${i + 1}`}
              />
            );
          })}
        </Select.Viewport>
      </Select.ContentWithPortal>
    </Select.Root>
  );
}
