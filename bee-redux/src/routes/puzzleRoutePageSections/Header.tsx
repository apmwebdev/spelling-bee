/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";
import { DesktopHeader } from "@/features/header/DesktopHeader";
import { MobileHeader } from "@/features/header/MobileHeader";

export function Header() {
  const columns = useColumnBreakpoints();
  if (columns > 1) {
    return <DesktopHeader />;
  }
  return <MobileHeader />;
}
