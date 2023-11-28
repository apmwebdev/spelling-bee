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
import { useAppDispatch } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  setPanelDisplayPropThunk,
} from "@/features/hintPanels";

export function HintContentBlurButton({
  panelUuid,
  isBlurred,
}: {
  panelUuid: string;
  isBlurred: boolean;
}) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelUuid,
        property: PanelCurrentDisplayStateProperties.isBlurred,
        value: !isBlurred,
      }),
    );
  };

  return (
    <IconButton
      type={isBlurred ? IconButtonTypeKeys.Show : IconButtonTypeKeys.Hide}
      tooltip={isBlurred ? "Show hint content" : "Hide hint content"}
      onClick={handleClick}
      className="HintContentBlurButton"
    />
  );
}
