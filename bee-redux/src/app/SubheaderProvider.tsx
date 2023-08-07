import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export interface SubheaderContextType {
  subheader: JSX.Element;
  setSubheader: Dispatch<SetStateAction<JSX.Element>>;
}

export const SubheaderContext = createContext({} as SubheaderContextType);

export function SubheaderProvider({ children }: { children: ReactNode }) {
  const [subheader, setSubheader] = useState(<></>);

  return (
    <SubheaderContext.Provider value={{ subheader, setSubheader }}>
      {children}
    </SubheaderContext.Provider>
  );
}
