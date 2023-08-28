import { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectPangrams } from "../../../puzzle/puzzleSlice";
import { calculateWordScore } from "@/utils";

export function AnswerAlert({ answerWord }: { answerWord: string }) {
  const pangrams = useAppSelector(selectPangrams);

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  }, []);

  if (!isActive) return null;

  const isPangram = (answerWord: string, pangrams: string[]) => {
    return pangrams.includes(answerWord);
  };

  const getMessage = (answerWord: string, pangrams: string[]) => {
    if (isPangram(answerWord, pangrams)) {
      return "Pangram!";
    }
    if (answerWord.length === 4) {
      return "Good!";
    }
    if (answerWord.length === 5 || answerWord.length === 6) {
      return "Nice!";
    }
    if (answerWord.length === 7 || answerWord.length === 8) {
      return "Awesome!";
    }
    if (answerWord.length >= 9) {
      return "Amazing!";
    }
    return "";
  };

  const getMessageClasses = (answerWord: string, pangrams: string[]) => {
    let messageClasses = "sb-answer-alert-message";
    if (isPangram(answerWord, pangrams)) {
      messageClasses += " pangram-alert-message";
    }
    return messageClasses;
  };

  return (
    <>
      <div className={getMessageClasses(answerWord, pangrams)}>
        {getMessage(answerWord, pangrams)}
      </div>
      <div className="sb-answer-alert-score">
        {`+${calculateWordScore(answerWord)}`}
      </div>
    </>
  );
}
