import React, { useContext } from "react";
import { GuessInputContext } from "@/features/guesses/providers/GuessInputProvider";

export function GuessInputEnter() {
  const { enterPressedEvent } = useContext(GuessInputContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    window.dispatchEvent(enterPressedEvent);
  };

  return (
    <button
      type="button"
      className="GuessInputEnter standardButton"
      onClick={handleClick}
    >
      Enter
    </button>
  );
}
