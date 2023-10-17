import { createContext, ReactNode } from "react";

type TGlobalContext = {
  closePopupsEvent: Event;
};

export const GlobalContext = createContext({} as TGlobalContext);
export function GlobalContextProvider({ children }: { children: ReactNode }) {
  /** Using React Router, navigation events don't reload the page, so dialogs,
   * popovers, etc. from Radix don't close. This means that, for example, when
   * clicking a link from inside a modal dialog, the page under the overlay
   * changes, but the dialog stays open. This is undesirable. This event is
   * designed to solve this so that navigation events can be made to trigger
   * this event, and then all popups can have a listener for it and close
   * themselves when this event is triggered.
   */
  const closePopupsEvent = new Event("closePopups");

  return (
    <GlobalContext.Provider value={{ closePopupsEvent }}>
      {children}
    </GlobalContext.Provider>
  );
}
