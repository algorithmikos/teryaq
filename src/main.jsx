import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./rtk/store";
import App from "./App.jsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <App />
      </Provider>
    {/* </React.StrictMode> */}
  </Router>
);
