/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  deleteUserPuzzleAttemptThunk,
  selectCurrentAttemptUuid,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import { BLANK_UUID } from "@/features/api";

export function DeleteAttemptButton() {
  const dispatch = useAppDispatch();
  const currentAttemptUuid = useAppSelector(selectCurrentAttemptUuid);
  const handleClick = () => {
    if (currentAttemptUuid === BLANK_UUID) return;
    dispatch(deleteUserPuzzleAttemptThunk(currentAttemptUuid));
  };

  return (
    <IconButton
      type={IconButtonTypeKeys.Delete}
      tooltip="Delete selected attempt"
      onClick={handleClick}
    />
  );
}
