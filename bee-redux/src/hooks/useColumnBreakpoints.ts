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
