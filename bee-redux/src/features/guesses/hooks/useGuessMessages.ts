import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";

type GuessMessageTypes = "" | "answer" | "error";

export type GuessMessagesOutput = {
  value: string[];
  status: GuessMessageTypes;
  clearMessagesTimeout: MutableRefObject<TimeoutId | null>;
  clear: () => void;
  update: (newMessages: string[], newMessageType: GuessMessageTypes) => void;
};

export const useGuessMessages = ({
  setGuessCssClasses,
  clearGuessTimeout,
  clearGuess,
}: {
  setGuessCssClasses: Dispatch<SetStateAction<string>>;
  clearGuessTimeout: MutableRefObject<TimeoutId | null>;
  clearGuess: () => void;
}): GuessMessagesOutput => {
  const [value, setValue] = useState<string[]>([]);
  const [status, setStatus] = useState<GuessMessageTypes>("");
  const clearMessagesTimeout = useRef<TimeoutId | null>(null);

  const clear = () => {
    setValue([]);
    setStatus("");
    setGuessCssClasses("");
    clearMessagesTimeout.current = null;
  };

  const update = (
    newMessages: string[],
    newMessagesType: GuessMessageTypes,
  ) => {
    clearMessagesTimeout.current = setTimeout(() => {
      clear();
    }, 1000);

    clearGuessTimeout.current = setTimeout(() => {
      clearGuess();
    }, 1000);

    setValue(newMessages);
    setStatus(newMessagesType);
    if (newMessagesType === "error") {
      setGuessCssClasses("error");
    }
  };

  return {
    value,
    status,
    clearMessagesTimeout,
    clear,
    update,
  };
};
