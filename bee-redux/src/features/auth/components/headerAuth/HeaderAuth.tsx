/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "@/features/auth/components/headerAuth/LoginButton";
import { SignupButton } from "@/features/auth/components/headerAuth/SignupButton";

export function HeaderAuth() {
  const user = useAppSelector(selectUser);
  const content = () => {
    if (user) {
      return (
        <>
          <span>Welcome, {user.name}</span>
          <UserMenu />
        </>
      );
    }
    return (
      <>
        <LoginButton />
        <SignupButton />
      </>
    );
  };

  return <div className="HeaderAuth">{content()}</div>;
}
