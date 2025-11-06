"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Lang } from "./translations";

const LANG_STORAGE_KEY = "knuut_lang";

interface TranslationContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return ((localStorage.getItem(LANG_STORAGE_KEY) as Lang) || "en");
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.lang) setLang(detail.lang as Lang);
    };
    window.addEventListener("knuut:languageChange", onLangChange as EventListener);
    return () => window.removeEventListener("knuut:languageChange", onLangChange as EventListener);
  }, []);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.en;
    return (key: string) => dict[key] || translations.en[key] || key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within a TranslationProvider");
  return ctx;
}


