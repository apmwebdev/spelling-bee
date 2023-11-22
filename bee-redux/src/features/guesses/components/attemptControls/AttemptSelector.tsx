/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
      value={`${currentAttempt.uuid}`}
      onValueChange={(value) => dispatch(setCurrentAttempt(value))}
    >
      <Select.Trigger />
      <Select.ContentWithPortal className="SelectContent">
        <Select.Viewport>
          {attempts.map((attempt, i) => {
            return (
              <Select.Item
                key={uniqid()}
                value={`${attempt.uuid}`}
                itemText={`Attempt ${i + 1}`}
              />
            );
          })}
        </Select.Viewport>
      </Select.ContentWithPortal>
    </Select.Root>
  );
}
