import { useState } from "react";
import classNames from "classnames/dedupe";

export const useMessage = () => {
  const [value, setValue] = useState("");
  const [classes, setClasses] = useState("Auth_message");

  const update = (message: string, status?: "success" | "error") => {
    setValue(message);
    setClasses(
      classNames({
        Auth_message: true,
        SuccessText: !status || status === "success",
        ErrorText: status === "error",
      }),
    );
  };

  const output = () => ({
    value,
    classes,
  });

  return { update, output };
};
