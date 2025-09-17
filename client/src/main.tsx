// DEV kill-switch to prove no hidden reloaders are active
if (import.meta.env.DEV) {
  const origReload = window.location.reload.bind(window.location);
  window.location.reload = () => {
    console.warn('[DEV] reload suppressed');
    // comment the next line back in if you need to allow one manual reload:
    // origReload();
  };
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable service workers entirely to prevent flicker
import * as sw from './serviceWorkerRegistration';
sw.unregister();

// Optional: Import safe version poller only in development
if (import.meta.env.DEV) {
  import('./version-poller');
}

createRoot(document.getElementById("root")!).render(<App />);
