/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
