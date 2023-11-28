/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ChangeEvent, FormEvent, useState } from "react";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function PanelNameInputForm({
  panelUuid,
  currentName,
  inputId,
}: {
  panelUuid: string;
  currentName: string;
  inputId: string;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const [name, setName] = useState(currentName);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 40) {
      setName(val);
      if (val.length > 0) {
        updatePanel({
          uuid: panelUuid,
          debounceField: "name",
          name: val,
        });
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="PanelNameInputForm" onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor={inputId}>Name:</label>
      <input
        type="text"
        className="PanelNameInput"
        value={name}
        id={inputId}
        autoComplete="off"
        placeholder="Panel name..."
        onChange={(e) => handleChange(e)}
      />
    </form>
  );
}
