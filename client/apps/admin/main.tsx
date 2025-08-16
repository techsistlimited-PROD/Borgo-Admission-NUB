import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./App";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
}
