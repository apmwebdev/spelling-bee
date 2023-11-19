/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { selectUser, Signup } from "@/features/auth";
import { useAppSelector } from "@/app/hooks";
import { Navigate } from "react-router-dom";

export function SignupRoute() {
  const user = useAppSelector(selectUser);

  if (user) return <Navigate to="/puzzle/latest" />;
  return (
    <div className="Auth_route">
      <h2>Sign Up</h2>
      <Signup />
    </div>
  );
}
