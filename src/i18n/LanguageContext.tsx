import { createContext, useContext, useState, useCallback, type FC, type PropsWithChildren } from "react";
import type { Language } from "./translations";
import { translations } from "./translations";

interface ILanguageContext {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  tCategory: (category?: string) => string;
  formatNumber: (value: number | string) => string;
  formatPrice: (value: number | string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<ILanguageContext>({
  lang: "ar",
  setLang: () => {},
  t: (key: string) => key,
  tCategory: (category?: string) => category ?? "",
  formatNumber: (value: number | string) => String(value),
  formatPrice: (value: number | string) => String(value),
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

  const tCategory = useCallback(
    (category?: string): string => {
      if (!category) return "";
      const key = `category.${category.trim().toLowerCase()}`;
      return translations[lang]?.[key] ?? translations.en?.[key] ?? category;
    },
    [lang]
  );

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  const formatNumber = useCallback(
    (value: number | string): string => {
      const n = typeof value === "string" ? Number(value) : value;
      if (Number.isNaN(n)) return String(value);
      return new Intl.NumberFormat(lang === "ar" ? "ar" : "en-US", {
        numberingSystem: lang === "ar" ? "arab" : "latn",
      }).format(n);
    },
    [lang]
  );

  const formatPrice = useCallback(
    (value: number | string): string =>
      `${formatNumber(value)} ${lang === "ar" ? "ل.س" : "SYP"}`,
    [formatNumber, lang]
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t, tCategory, formatNumber, formatPrice, dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
