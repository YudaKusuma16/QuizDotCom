import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QuizProvider } from "./context/QuizContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuizProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QuizProvider>
  </StrictMode>
);
