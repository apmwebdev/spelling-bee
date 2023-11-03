import { userDataApiSlice } from "@/features/userData";
import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";
import classNames from "classnames/dedupe";

const DARK_MODE_CLASS = "App___darkTheme";
const LIGHT_MODE_CLASS = "App___lightTheme";

export function useAppClasses() {
  const prefsQuery =
    userDataApiSlice.endpoints.getUserPrefs.useQueryState(undefined);
  const columns = useColumnBreakpoints();
  const appClasses = classNames("App", {
    App___threeColumns: columns === 3,
    App___twoColumns: columns === 2,
    App___oneColumn: columns === 1,
  });

  const darkModeClasses = classNames(appClasses, DARK_MODE_CLASS);
  const lightModeClasses = classNames(appClasses, LIGHT_MODE_CLASS);

  if (
    prefsQuery.isError ||
    prefsQuery.isLoading ||
    prefsQuery.isUninitialized
  ) {
    if (matchMedia("(prefers-color-scheme: light)").matches) {
      return lightModeClasses;
    }
    return darkModeClasses;
  }
  if (prefsQuery.isSuccess) {
    const colorPref = prefsQuery.data.colorScheme;
    if (colorPref === "light") return lightModeClasses;
    if (colorPref === "dark") return darkModeClasses;
    if (matchMedia("(prefers-color-scheme: light)").matches) {
      return lightModeClasses;
    }
  }
  return darkModeClasses;
}
