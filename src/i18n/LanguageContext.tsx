import { createContext, useContext, useState, useCallback, type FC, type PropsWithChildren } from "react";
import type { Language } from "./translations";
import { translations } from "./translations";

interface ILanguageContext {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<ILanguageContext>({
  lang: "ar",
  setLang: () => {},
  t: (key: string) => key,
  dir: "rtl",
});

export const useLang = () => useContext(LanguageContext);

export const LanguageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("lang");
    return saved === "en" || saved === "ar" ? saved : "ar";
  });

  const setLang = useCallback((newLang: Language) => {
    const validLang = newLang === "en" ? "en" : "ar";
    setLangState(validLang);
    localStorage.setItem("lang", validLang);
    document.documentElement.dir = validLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = validLang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const activeLang = lang === "en" || lang === "ar" ? lang : "ar";
      return translations[activeLang]?.[key] ?? translations.en?.[key] ?? key;
    },
    [lang]
  );

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
