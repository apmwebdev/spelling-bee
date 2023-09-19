import React from "react";
import LetterCell from "./LetterCell";
import { useAppSelector } from "@/app/hooks";
import { selectPuzzle } from "@/features/puzzle";
import uniqid from "uniqid";

export function Hive() {
  const puzzle = useAppSelector(selectPuzzle);
  return (
    <div className="HiveContainer">
      <div className="Hive">
        <LetterCell letter={puzzle.centerLetter} isCenter={true} />
        {puzzle.outerLetters.map((letter) => {
          return <LetterCell key={uniqid()} letter={letter} isCenter={false} />;
        })}
      </div>
    </div>
  );
}
