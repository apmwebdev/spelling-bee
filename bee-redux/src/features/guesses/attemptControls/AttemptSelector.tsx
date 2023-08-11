import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAttempts, selectCurrentAttempt, setCurrentAttempt } from "../guessesSlice";
import * as Select from "@radix-ui/react-select";
import uniqid from "uniqid";
import { Icon } from "@iconify/react";

export function AttemptSelector() {
  const dispatch = useAppDispatch();
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const attempts = useAppSelector(selectAttempts);
  return (
    <Select.Root
      value={`${currentAttempt.id}`}
      onValueChange={(value) => dispatch(setCurrentAttempt(Number(value)))}
    >
      <Select.Trigger className="SelectTrigger">
        <Select.Value />
        <Select.Icon asChild>
          <Icon icon="mdi:chevron-down" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.Viewport>
            {attempts.map((attempt, i) => {
              return (
                <Select.Item
                  key={uniqid()}
                  value={`${attempt.id}`}
                  className="SelectItem"
                >
                  <Select.ItemText>Attempt {i + 1}</Select.ItemText>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
