import { HintPanelData } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { ChangeEvent, FormEvent, useState } from "react";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function PanelNameInputForm({
  panel,
  inputId,
}: {
  panel: HintPanelData;
  inputId: string;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 40) {
      updatePanel({
        id: panel.id,
        debounceField: "name",
        name: e.target.value,
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form
      className="PanelNameInputForm"
      onSubmit={(e) => handleSubmit(e)}
    >
      <label htmlFor={inputId}>Name:</label>
      <input
        type="text"
        className="PanelNameInput"
        value={panel.name}
        id={inputId}
        autoComplete="off"
        placeholder="Panel name..."
        onChange={(e) => handleChange(e)}
      />
    </form>
  );
}
