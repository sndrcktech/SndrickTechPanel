import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Если используешь Tailwind, тут импортируется его CSS

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
