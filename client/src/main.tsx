import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('[BUILD_TAG] HOME_PUBLIC_TEST', new Date().toISOString());

createRoot(document.getElementById("root")!).render(<App />);
