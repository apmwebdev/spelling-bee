interface GuessAlertsProps {
  messages: string[]
}

export function GuessAlerts({ messages }: GuessAlertsProps) {
  const messageOutput = messages.join("\n ")
  return <div className="sb-guess-input-alerts">{messageOutput}</div>
}
