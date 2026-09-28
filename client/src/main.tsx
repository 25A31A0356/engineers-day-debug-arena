import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App";
import "./index.css";
import { setupClientApiBridge } from "./lib/clientApi";

// Initialize client API bridge for seamless GitHub Pages / offline operation
setupClientApiBridge();

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

createRoot(document.getElementById("root")!).render(<App />);
