import React from "react";
import LetterCell from "./LetterCell";
import { useAppSelector } from "@/app/hooks";
import {
  selectCenterLetter,
  selectShuffledOuterLetters,
} from "@/features/puzzle";
import uniqid from "uniqid";

export function Hive() {
  const centerLetter = useAppSelector(selectCenterLetter);
  const outerLetters = useAppSelector(selectShuffledOuterLetters);
  return (
    <div className="HiveContainer">
      <div className="Hive">
        <LetterCell letter={centerLetter} isCenter={true} />
        {outerLetters.map((letter) => {
          return <LetterCell key={uniqid()} letter={letter} isCenter={false} />;
        })}
      </div>
    </div>
  );
}
