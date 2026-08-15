import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./main.css";

const savedLang = localStorage.getItem("lang");
if (savedLang === "en") {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
} else {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
