import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./dev/once-cache-reset";

createRoot(document.getElementById("root")!).render(<App />);
