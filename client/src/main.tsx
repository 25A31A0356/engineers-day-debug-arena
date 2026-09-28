import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App";
import "./index.css";

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

createRoot(document.getElementById("root")!).render(<App />);
