import { useEffect, useState } from "react";
import uniqid from "uniqid";

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
    <ul className="sb-error-alert-message">
      {errorMessages.map((errorMessage) => (
        <li className="sb-error-alert-item" key={uniqid()}>
          {errorMessage}
        </li>
      ))}
    </ul>
  );
}
