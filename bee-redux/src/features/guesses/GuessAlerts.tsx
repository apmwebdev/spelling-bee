export interface GuessAlertsProps {
  messages: string[]
  messagesType: "answer" | "error" | ""
}

export function initialGuessAlerts(): GuessAlertsProps {
  return {
    messages: [],
    messagesType: "",
  }
}

export function GuessAlerts({ messages, messagesType }: GuessAlertsProps) {
  const messageOutput = () => {
    return messages.join("\n ")
  }

  return (
    <div className="sb-guess-input-alerts-container">
      {messageOutput()}
    </div>
  )
}
