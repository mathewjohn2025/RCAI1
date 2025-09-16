import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./dev/once-cache-reset";
import { ensureFreshBuild } from "./lib/version";

// Check for build updates before rendering
ensureFreshBuild().catch(console.warn);

createRoot(document.getElementById("root")!).render(<App />);
