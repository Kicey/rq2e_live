import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./app/App";
import { ensureWebCryptoDigest } from "./lib/ensureWebCryptoDigest";
import "../styles.css";

ensureWebCryptoDigest();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
