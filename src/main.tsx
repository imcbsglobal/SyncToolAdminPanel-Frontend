// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Import Material Icons
document.head.innerHTML += `
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
