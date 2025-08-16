import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ApplicantPortalApp from "./App";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ApplicantPortalApp />
    </StrictMode>
  );
}
