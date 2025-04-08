import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createDispatchHook, createSelectorHook, Provider } from "react-redux";
import { store } from "./redux/index.ts";

const store1Context = React.createContext("");
//@ts-ignore
export const useStoreDispatch = createDispatchHook(store1Context);
//@ts-ignore
export const useStoreSelector = createSelectorHook(store1Context);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store} context={store1Context}>
      <App />
    </Provider>
  </React.StrictMode>
);
