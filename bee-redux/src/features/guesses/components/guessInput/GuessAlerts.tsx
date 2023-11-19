/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AnswerAlert } from "./guessAlerts/AnswerAlert";
import { ErrorAlert } from "./guessAlerts/ErrorAlert";

export type GuessAlertsProps = {
  messages: string[];
  messagesType: "answer" | "error" | "";
};

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
