import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('[BUILD_TAG]', new Date().toISOString());

createRoot(document.getElementById("root")!).render(<App />);
