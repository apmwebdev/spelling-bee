/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Icon } from "@iconify/react";

export function HeaderDisclosureWidget({ title }: { title: string }) {
  // Note: icon is rotated in CSS to indicate collapsed state.
  return (
    <div className="HeaderDisclosureWidget">
      <Icon
        icon="mdi:chevron-right"
        className="HeaderDisclosureWidgetIcon"
      ></Icon>
      <div>{title}</div>
    </div>
  );
}
