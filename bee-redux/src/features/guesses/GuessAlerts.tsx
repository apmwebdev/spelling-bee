interface GuessAlertsProps {
  errorMessages: string[]
}

export function GuessAlerts({ errorMessages }: GuessAlertsProps) {
  const errorOutput = errorMessages.join("\n ")
  return <div className="sb-guess-input-alerts">{errorOutput}</div>
}
