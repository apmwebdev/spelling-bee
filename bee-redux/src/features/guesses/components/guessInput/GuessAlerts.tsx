import { AnswerAlert } from "./guessAlerts/AnswerAlert";
import { ErrorAlert } from "./guessAlerts/ErrorAlert";

export type GuessAlertsProps = {
  messages: string[];
  messagesType: "answer" | "error" | "";
};

export function initialGuessAlerts(): GuessAlertsProps {
  return {
    messages: [],
    messagesType: "",
  };
}

export function GuessAlerts({ messages, messagesType }: GuessAlertsProps) {
  const messageOutput = () => {
    if (messagesType === "answer") {
      return <AnswerAlert answerWord={messages[0]} />;
    } else if (messagesType === "error") {
      return <ErrorAlert errorMessages={messages} />;
    }
    return null;
  };

  return <div className="GuessAlertsContainer">{messageOutput()}</div>;
}
