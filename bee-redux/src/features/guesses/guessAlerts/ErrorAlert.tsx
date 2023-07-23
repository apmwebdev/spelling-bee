import { useEffect, useState } from "react";

export function ErrorAlert({ errorMessages }: { errorMessages: string[] }) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <ul className="sb-error-alerts">
      {errorMessages.map((errorMessage) => (
        <li className="sb-answer-alert-item">{errorMessage}</li>
      ))}
    </ul>
  );
}
