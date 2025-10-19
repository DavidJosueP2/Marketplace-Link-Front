import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AppProviders from "@/inc/providers/AppProviders";
import "@/index.css";

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
