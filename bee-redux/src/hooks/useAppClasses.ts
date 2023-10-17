import { userDataApiSlice } from "@/features/userData";

const DARK_MODE_CLASSES = "App dark-theme";
const LIGHT_MODE_CLASSES = "App light-theme";

export function useAppClasses() {
  const prefsQuery =
    userDataApiSlice.endpoints.getUserPrefs.useQueryState(undefined);

  if (
    prefsQuery.isError ||
    prefsQuery.isLoading ||
    prefsQuery.isUninitialized
  ) {
    if (matchMedia("(prefers-color-scheme: light)").matches) {
      return LIGHT_MODE_CLASSES;
    }
    return DARK_MODE_CLASSES;
  }
  if (prefsQuery.isSuccess) {
    const colorPref = prefsQuery.data.colorScheme;
    if (colorPref === "light") return LIGHT_MODE_CLASSES;
    if (colorPref === "dark") return DARK_MODE_CLASSES;
    if (matchMedia("(prefers-color-scheme: light)").matches) {
      return LIGHT_MODE_CLASSES;
    }
  }
  return DARK_MODE_CLASSES;
}
