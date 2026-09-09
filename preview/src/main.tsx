import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DesignSystemPlayground } from "../../src/DesignSystemPlayground";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DesignSystemPlayground />
  </React.StrictMode>
);
