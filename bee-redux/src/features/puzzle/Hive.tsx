import React, { FC } from "react";
import LetterCell from "./LetterCell";
import { useAppSelector } from "../../app/hooks";
import { selectPuzzle } from "./puzzleSlice";
import uniqid from "uniqid";

const Hive: FC = () => {
  const puzzle = useAppSelector(selectPuzzle);
  return (
    <div className="hive-container">
      <div className="hive">
        <LetterCell letter={puzzle.centerLetter} isCenter={true} />
        {puzzle.outerLetters.map((letter) => {
          return <LetterCell key={uniqid()} letter={letter} isCenter={false} />;
        })}
      </div>
    </div>
  );
};

export default Hive;
