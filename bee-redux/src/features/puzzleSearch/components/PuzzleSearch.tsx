import { Icon } from "@iconify/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function PuzzleSearch() {
  const navigate = useNavigate();
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return navigate(`/puzzle/${puzzleIdentifier}`);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
      setPuzzleIdentifier(e.target.value);
    }
  };

  return (
    <div className="PuzzleSearch">
      <form className="sb-puzzle-search" onSubmit={handleSearch}>
        <Icon icon="mdi:search" />
        <input
          type="text"
          name="identifierInput"
          value={puzzleIdentifier}
          placeholder="Date, ID, or letters"
          onChange={(e) => handleSearchInput(e)}
        />
      </form>
    </div>
  );
}
