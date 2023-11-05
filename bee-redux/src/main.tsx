import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/styles.scss";
import React from "react";
import { store } from "@/app/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("Root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
