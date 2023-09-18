import React, { useContext } from "react";
import { GuessInputContext } from "@/app/GuessInputProvider";

export function GuessInputEnter() {
  const { enterPressedEvent } = useContext(GuessInputContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    window.dispatchEvent(enterPressedEvent);
  };

  return (
    <button
      type="button"
      className="sb-guess-input-enter standard-button"
      onClick={handleClick}
    >
      Enter
    </button>
  );
}
