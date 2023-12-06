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
import { useAddAttemptMutation } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";
import { useAppSelector } from "@/app/hooks";
import { selectPuzzleId } from "@/features/puzzle";

export function NewAttemptButton() {
  const [addAttempt] = useAddAttemptMutation();
  const puzzleId = useAppSelector(selectPuzzleId);
  const handleClick = async () => {
    await addAttempt({
      uuid: crypto.randomUUID(),
      puzzleId: puzzleId,
      createdAt: Date.now(),
    });
  };

  return (
    <IconButton
      type={IconButtonTypeKeys.Create}
      tooltip="Create new attempt"
      onClick={handleClick}
    />
  );
}
