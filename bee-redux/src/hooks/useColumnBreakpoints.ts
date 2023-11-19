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

const breakpoints = {
  threeColumns: 1394,
  twoColumns: 944,
};

export const useColumnBreakpoints = () => {
  const getColumnCount = (width: number) => {
    if (width >= breakpoints.threeColumns) {
      return 3;
    } else if (width >= breakpoints.twoColumns) {
      return 2;
    }
    return 1;
  };

  const [columnCount, setColumnCount] = useState(
    getColumnCount(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return columnCount;
};
