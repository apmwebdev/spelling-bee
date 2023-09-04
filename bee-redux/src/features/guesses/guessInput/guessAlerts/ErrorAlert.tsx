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
    <ul className="ErrorAlertMessage">
      {errorMessages.map((errorMessage) => (
        <li className="ErrorAlertItem" key={uniqid()}>
          {errorMessage}
        </li>
      ))}
    </ul>
  );
}
