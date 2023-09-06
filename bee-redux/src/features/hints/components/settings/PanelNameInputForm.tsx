import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { ChangeEvent, FormEvent, useState } from "react";

export function PanelNameInputForm({
  panelId,
  currentName,
  inputId,
}: {
  panelId: number;
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
          id: panelId,
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
