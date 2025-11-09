"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "./i18n/TranslationProvider";
import { usePathname } from "next/navigation";

type Lang = "fi" | "en" | "es" | "pt" | "ar" | "ru";

const LANG_STORAGE_KEY = "knuut_lang";

export default function GlobalHeader() {
  const pathname = usePathname();
  const { lang: ctxLang, setLang: setCtxLang, t } = useTranslation();
  const [lang, setLang] = useState<Lang>(ctxLang);

  // Apply language to html attribute and store
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
    setCtxLang(lang);
  }, [lang, setCtxLang]);

  useEffect(() => {
    setLang(ctxLang);
  }, [ctxLang]);

  // Skip auto-translation on Learn Finnish page
  const isLearnFinnish = pathname?.startsWith("/learn-finnish");

  // Broadcast a custom event for components to translate themselves when supported
  useEffect(() => {
    if (isLearnFinnish) return;
    window.dispatchEvent(new CustomEvent("knuut:languageChange", { detail: { lang } }));
  }, [lang, isLearnFinnish]);

  const handleAskKnuut = () => {
    window.location.href = "/knuut-voice";
  };

  const handleCreateEvent = () => {
    window.location.href = "/knuut-voice";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "saturate(1.2) blur(16px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#111827",
            cursor: "pointer",
          }}
          aria-label="Language selector"
        >
          <option value="fi">🇫🇮 FI</option>
          <option value="en">🇬🇧 EN</option>
          <option value="es">🇪🇸 ES</option>
          <option value="pt">🇵🇹 PT</option>
          <option value="ar">🇸🇦 AR</option>
          <option value="ru">🇷🇺 RU</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={handleAskKnuut}
          style={{
            padding: "8px 14px",
            background: "white",
            border: "2px solid #c7d2fe",
            borderRadius: 10,
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#4338ca",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 8px rgba(67,56,202,0.08)",
          }}
          title={t("ask_knuut")}
        >
          <span aria-hidden>🎤</span>
          <span>{t("ask_knuut")}</span>
        </button>

        <button
          onClick={handleCreateEvent}
          style={{
            padding: "10px 18px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: "0.3px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(102,126,234,0.25)",
          }}
        >
          <span style={{ marginRight: 8 }} aria-hidden>＋</span>
          {t("create_event")}
        </button>
      </div>
    </div>
  );
}


