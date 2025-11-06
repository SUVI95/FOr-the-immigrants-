"use client";

import { useState, useEffect } from "react";

type FinnishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | null;

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  type: "vocabulary" | "grammar" | "pronunciation" | "conversation" | "quiz";
  prompt: string; // What to ask Knuut
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  vocabulary: string[];
  grammar: string[];
  conversation: string;
  activities: LearningActivity[];
}

// Structure inspired by "My Finnish Journey" (formerly Suomen mestari 1)
const chaptersByLevel: Record<FinnishLevel, Chapter[]> = {
  A1: [
    {
      id: "kappale-1",
      number: 1,
      title: "Hei ja tervetuloa!",
      description: "Tutustuminen, tervehdykset, viikonpäivät, aakkoset, numerot, olla-verbi, vokaaliharmonia",
      vocabulary: [
        "tervehdykset (greetings): Hei, Moi, Tervetuloa, Hyvää huomenta, Hyvää päivää, Hyvää iltaa",
        "viikonpäivät (days of week): maanantai, tiistai, keskiviikko, torstai, perjantai, lauantai, sunnuntai",
        "aakkoset (alphabet): A-Z, Ä, Ö",
        "numerot (numbers): nolla, yksi, kaksi, kolme... sata, tuhat",
      ],
      grammar: [
        "persoonapronominit (personal pronouns): minä, sinä, hän, me, te, he",
        "olla-verbi (verb 'to be'): olen, olet, on, olemme, olette, ovat",
        "vokaaliharmonia (vowel harmony): -ssa/-ssä, -lla/-llä, -vat/-vät",
      ],
      conversation: "Jäätelökioskilla - ordering ice cream",
      activities: [
        {
          id: "k1-vocab-1",
          title: "Tervehdykset ja tutustuminen",
          description: "Learn greetings and introductions: Hei, Moi, Tervetuloa, Hauska tutustua!",
          type: "vocabulary",
          prompt: "Teach me Finnish greetings and introductions (My Finnish Journey – Chapter 1). Include: Hei, Moi, Tervetuloa, Hauska tutustua, Mikä sinun nimi on?",
        },
        {
          id: "k1-vocab-2",
          title: "Viikonpäivät",
          description: "Learn days of the week: maanantai, tiistai, keskiviikko...",
          type: "vocabulary",
          prompt: "Teach me Finnish days of the week: maanantai, tiistai, keskiviikko, torstai, perjantai, lauantai, sunnuntai. Also teach: eilen, tänään, huomenna.",
        },
        {
          id: "k1-vocab-3",
          title: "Numerot 0-100",
          description: "Learn numbers: nolla, yksi, kaksi... sata",
          type: "vocabulary",
          prompt: "Teach me Finnish numbers from 0 to 100. Include: nolla, yksi, kaksi, kymmenen, kaksikymmentä, sata.",
        },
        {
          id: "k1-grammar-1",
          title: "Persoonapronominit ja olla-verbi",
          description: "Personal pronouns and the verb 'to be'",
          type: "grammar",
          prompt: "Explain Finnish personal pronouns (minä, sinä, hän, me, te, he) and the verb 'olla' (to be): olen, olet, on, olemme, olette, ovat. Give examples from My Finnish Journey.",
        },
        {
          id: "k1-grammar-2",
          title: "Vokaaliharmonia",
          description: "Vowel harmony: -ssa/-ssä, -lla/-llä, -vat/-vät",
          type: "grammar",
          prompt: "Explain Finnish vowel harmony (vokaaliharmonia) with examples. When to use -ssa vs -ssä, -lla vs -llä, -vat vs -vät?",
        },
        {
          id: "k1-pronunciation-1",
          title: "Ääntäminen: Vokaalit",
          description: "Practice Finnish vowels: a, e, i, o, u, ä, ö, y",
          type: "pronunciation",
          prompt: "Help me practice Finnish vowel sounds (a, e, i, o, u, ä, ö, y) with examples. Explain the difference between short and long vowels.",
        },
        {
          id: "k1-conversation-1",
          title: "Keskustelu: Tervetuloa kurssille",
          description: "Practice: Welcome to the course conversation",
          type: "conversation",
          prompt: "Let's practice a conversation (My Finnish Journey – Chapter 1). I'm a new student and you're the teacher. Welcome me to the Finnish course and help me introduce myself.",
        },
      ],
    },
    {
      id: "kappale-2",
      number: 2,
      title: "Minkämaalainen sinä olet?",
      description: "Maat, kansallisuuudet, kielet, verbin persoonataivutus, negatiivinen lause, kysymykset",
      vocabulary: [
        "maat (countries): Suomi, Ranska, Brasilia, Venäjä, Etelä-Afrikka",
        "kansalaisuudet (nationalities): suomalainen, ranskalainen, brasilialainen, venäläinen",
        "kielet (languages): suomi, ranska, portugali, venäjä, englanti",
      ],
      grammar: [
        "verbin persoonataivutus (verb conjugation): puhun, puhut, puhuu, puhumme, puhutte, puhuvat",
        "negatiivinen lause (negative sentences): en, et, ei, emme, ette, eivät",
        "kysymykset (questions): kuka, mikä, mitä, missä, mistä, miksi, minkämaalainen",
        "ko/kö-kysymys: Oletko sinä suomalainen?",
        "k-p-t-vaihtelu: Afrikka → Afrikasta, Eurooppa → Euroopassa",
      ],
      conversation: "Jäätelökioskilla - ordering ice cream, asking about nationalities",
      activities: [
        {
          id: "k2-vocab-1",
          title: "Maat ja kansalaisuudet",
          description: "Learn countries and nationalities",
          type: "vocabulary",
          prompt: "Teach me Finnish countries and nationalities (My Finnish Journey – Chapter 2). Include: Suomi/suomalainen, Ranska/ranskalainen, Brasilia/brasilialainen, Venäjä/venäläinen.",
        },
        {
          id: "k2-vocab-2",
          title: "Kielet",
          description: "Learn languages: suomi, englanti, ranska, portugali...",
          type: "vocabulary",
          prompt: "Teach me Finnish vocabulary for languages: suomi, englanti, ranska, portugali, venäjä. How to say 'I speak...' and 'What language do you speak?'",
        },
        {
          id: "k2-grammar-1",
          title: "Verbin persoonataivutus",
          description: "Verb conjugation: puhun, puhut, puhuu...",
          type: "grammar",
          prompt: "Explain Finnish verb conjugation (personaivutus) for verb type 1 verbs like 'puhua'. Show all forms: minä puhun, sinä puhut, hän puhuu, me puhumme, te puhutte, he puhuvat.",
        },
        {
          id: "k2-grammar-2",
          title: "Negatiivinen lause",
          description: "Negative sentences: en, et, ei...",
          type: "grammar",
          prompt: "Explain Finnish negative sentences. Teach: minä en puhu, sinä et puhu, hän ei puhu, me emme puhu, te ette puhu, he eivät puhu.",
        },
        {
          id: "k2-grammar-3",
          title: "Kysymykset ja kysymyssanat",
          description: "Questions: kuka, mikä, mitä, missä, mistä...",
          type: "grammar",
          prompt: "Teach me Finnish question words (My Finnish Journey): kuka, mikä, mitä, missä, mistä, miksi, minkämaalainen. Also teach ko/kö-questions like 'Oletko sinä suomalainen?'",
        },
        {
          id: "k2-grammar-4",
          title: "k-p-t-vaihtelu",
          description: "k-p-t alternation: Afrikka → Afrikasta",
          type: "grammar",
          prompt: "Explain Finnish k-p-t alternation (k-p-t-vaihtelu) with examples from My Finnish Journey: Afrikka → Afrikasta, Eurooppa → Euroopassa, Turku → Turussa.",
        },
        {
          id: "k2-conversation-1",
          title: "Puhutaan: Jäätelökioskilla",
          description: "Practice: At the ice cream kiosk",
          type: "conversation",
          prompt: "Let's practice the conversation (My Finnish Journey – Chapter 2: Jäätelökioskilla). I'll order ice cream and we'll practice asking about prices and nationalities.",
        },
      ],
    },
    {
      id: "kappale-3",
      number: 3,
      title: "Sähköposti Mikolle",
      description: "Sää, vuodenajat, kuukaudet, adjektiivit, genetiivi, k-p-t-vaihtelu verbityyppi 1",
      vocabulary: [
        "sää (weather): kuuma, kylmä, lämmin, viileä, aurinkoista, sateista, tuulista",
        "vuodenajat (seasons): talvi, kevät, kesä, syksy",
        "kuukaudet (months): tammikuu, helmikuu, maaliskuu... joulukuu",
        "adjektiivit (adjectives): hyvä, huono, kaunis, pieni, iso, uusi, vanha",
        "värit (colors): valkoinen, musta, punainen, sininen, vihreä, keltainen",
      ],
      grammar: [
        "genetiivi (genitive case): Pedron, Alexin, Helsingin, kivan opettajan",
        "k-p-t-vaihtelu verbityyppi 1: nukkua (nukun, nukut, nukkuu), kirjoittaa, lukea",
      ],
      conversation: "Voitko auttaa minua? - Can you help me?",
      activities: [
        {
          id: "k3-vocab-1",
          title: "Sää ja ilma",
          description: "Learn weather vocabulary",
          type: "vocabulary",
          prompt: "Teach me Finnish weather vocabulary (My Finnish Journey – Chapter 3): kuuma, kylmä, lämmin, viileä, aurinkoista, sateista, tuulista, pilvistä. How to say 'How many degrees?' and temperatures.",
        },
        {
          id: "k3-vocab-2",
          title: "Vuodenajat ja kuukaudet",
          description: "Learn seasons and months",
          type: "vocabulary",
          prompt: "Teach me Finnish seasons (talvi, kevät, kesä, syksy) and all 12 months (tammikuu, helmikuu... joulukuu) from My Finnish Journey.",
        },
        {
          id: "k3-vocab-3",
          title: "Adjektiivit ja värit",
          description: "Learn adjectives and colors",
          type: "vocabulary",
          prompt: "Teach me Finnish adjectives and colors (My Finnish Journey): hyvä, huono, kaunis, pieni, iso, uusi, vanha, valkoinen, musta, punainen, sininen, vihreä, keltainen.",
        },
        {
          id: "k3-grammar-1",
          title: "Genetiivi",
          description: "Genitive case: Pedron, Alexin, Helsingin...",
          type: "grammar",
          prompt: "Explain Finnish genitive case (genetiivi) from My Finnish Journey – Chapter 3. Show examples: Pedron tyttöystävä, Alexin kotimaa, Helsingin sää, kivan opettajan nimi.",
        },
        {
          id: "k3-grammar-2",
          title: "k-p-t-vaihtelu: verbityyppi 1",
          description: "k-p-t alternation in verb type 1: nukkua, kirjoittaa, lukea",
          type: "grammar",
          prompt: "Explain k-p-t alternation in Finnish verb type 1 verbs from My Finnish Journey: nukkua (nukun, nukut, nukkuu), kirjoittaa, lukea, ymmärtää, ottaa. Show all personal forms.",
        },
        {
          id: "k3-conversation-1",
          title: "Puhutaan: Voitko auttaa minua?",
          description: "Practice: Can you help me?",
          type: "conversation",
          prompt: "Let's practice the conversation (My Finnish Journey – Chapter 3: 'Voitko auttaa minua?'). Help me translate words and phrases from English to Finnish.",
        },
      ],
    },
    {
      id: "kappale-4",
      number: 4,
      title: "Minä",
      description: "Perhe, ulkonäkö, partitiivi, Minulla on...",
      vocabulary: [
        "perhe (family): äiti, isä, isoveli, pikkusisko, vaimo, mies, lapsi, tyttö, poika",
        "ulkonäkö (appearance): pitkä, lyhyt, hoikka, tukeva, vaalea, tumma, kihara, suora tukka",
        "silmät (eyes): siniset, ruskeat, vihreät silmät",
      ],
      grammar: [
        "partitiivi (partitive case): taloa, maata, kirjettä, bussia",
        "Minulla on... (I have...): Minulla on auto. Minulla ei ole autoa.",
        "genetiivi + kanssa: Pedron kanssa, Hannan kanssa",
      ],
      conversation: "Pedro ilmoittautuu kurssille - Pedro enrolls in a course",
      activities: [
        {
          id: "k4-vocab-1",
          title: "Perhe",
          description: "Learn family vocabulary",
          type: "vocabulary",
          prompt: "Teach me Finnish family vocabulary from SUOMEN mestari 1, Kappale 4: äiti, isä, isoveli, pikkusisko, vaimo, mies, lapsi, tyttö, poika, veli, sisko.",
        },
        {
          id: "k4-vocab-2",
          title: "Ulkonäkö",
          description: "Learn appearance vocabulary",
          type: "vocabulary",
          prompt: "Teach me Finnish vocabulary for describing appearance from SUOMEN mestari 1: pitkä, lyhyt, hoikka, tukeva, vaalea, tumma, kihara, suora tukka, siniset/ruskeat/vihreät silmät.",
        },
        {
          id: "k4-grammar-1",
          title: "Partitiivi",
          description: "Partitive case: taloa, maata, kirjettä...",
          type: "grammar",
          prompt: "Explain Finnish partitive case (partitiivi) from SUOMEN mestari 1, Kappale 4. Show examples: taloa, maata, kirjettä, bussia, museota, venettä. When to use partitive?",
        },
        {
          id: "k4-grammar-2",
          title: "Minulla on...",
          description: "I have...: Minulla on auto. Minulla ei ole autoa.",
          type: "grammar",
          prompt: "Explain 'Minulla on...' structure from SUOMEN mestari 1: Minulla on auto. Sinulla on koira. Hänellä on bussilippu. Minulla ei ole autoa. Show all forms.",
        },
        {
          id: "k4-grammar-3",
          title: "Genetiivi + kanssa",
          description: "Genitive + kanssa: Pedron kanssa",
          type: "grammar",
          prompt: "Explain how to use genitive + kanssa in Finnish: Pedro asuu Hannan kanssa. Olga on Pedron ja Alexin kanssa kurssilla.",
        },
        {
          id: "k4-conversation-1",
          title: "Puhutaan: Pedro ilmoittautuu kurssille",
          description: "Practice: Pedro enrolls in a course",
          type: "conversation",
          prompt: "Let's practice the conversation from SUOMEN mestari 1, Kappale 4: Pedro ilmoittautuu kurssille. I'll be Pedro and you'll be the course secretary. Help me enroll in a Finnish course.",
        },
      ],
    },
  ],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  null: [],
};

interface FinnishLearningPanelProps {
  onActivityClick: (prompt: string) => void;
}

export default function FinnishLearningPanel({ onActivityClick }: FinnishLearningPanelProps) {
  const [selectedLevel, setSelectedLevel] = useState<FinnishLevel>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Load saved level from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem("finnishLearningLevel") as FinnishLevel;
    if (savedLevel && chaptersByLevel[savedLevel] && chaptersByLevel[savedLevel].length > 0) {
      setSelectedLevel(savedLevel);
      // Auto-expand first chapter
      const firstChapter = chaptersByLevel[savedLevel][0];
      if (firstChapter) {
        setExpandedChapter(firstChapter.id);
      }
    } else {
      setSelectedLevel("A1"); // Default to A1
      const firstChapter = chaptersByLevel["A1"][0];
      if (firstChapter) {
        setExpandedChapter(firstChapter.id);
      }
    }
  }, []);

  const handleLevelSelect = (level: FinnishLevel) => {
    setSelectedLevel(level);
    if (level && chaptersByLevel[level] && chaptersByLevel[level].length > 0) {
      localStorage.setItem("finnishLearningLevel", level);
      // Auto-expand first chapter
      const firstChapter = chaptersByLevel[level][0];
      if (firstChapter) {
        setExpandedChapter(firstChapter.id);
      }
    } else {
      localStorage.removeItem("finnishLearningLevel");
      setExpandedChapter(null);
    }
  };

  const handleChapterToggle = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const getActivityIcon = (type: LearningActivity["type"]) => {
    switch (type) {
      case "vocabulary":
        return "📚";
      case "grammar":
        return "📝";
      case "pronunciation":
        return "🎤";
      case "conversation":
        return "💬";
      case "quiz":
        return "❓";
      default:
        return "📖";
    }
  };

  const chapters = selectedLevel ? chaptersByLevel[selectedLevel] : [];

  if (!selectedLevel || chapters.length === 0) {
    return (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px", fontWeight: 600, color: "var(--brand)" }}>
          🇫🇮 Learn Finnish with Knuut
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "20px" }}>
          Select your current Finnish language level to get started with structured activities (My Finnish Journey).
        </p>
        <div className="level-selection" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          {(["A1", "A2", "B1", "B2", "C1"] as FinnishLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => handleLevelSelect(level)}
              className={`level-button ${selectedLevel === level ? "active" : ""}`}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: `1px solid ${selectedLevel === level ? "var(--brand)" : "#e2e8f0"}`,
                background: selectedLevel === level ? "var(--brand-light)" : "white",
                color: selectedLevel === level ? "var(--brand)" : "var(--text)",
                fontWeight: selectedLevel === level ? "bold" : "normal",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                fontSize: "14px",
              }}
            >
              {level}
              {level === "A1" && " (Beginner)"}
              {level === "A2" && " (Elementary)"}
              {level === "B1" && " (Intermediate)"}
              {level === "B2" && " (Upper Intermediate)"}
              {level === "C1" && " (Advanced)"}
            </button>
          ))}
        </div>
        {selectedLevel && chapters.length === 0 && (
          <p style={{ fontSize: "14px", color: "var(--muted)", fontStyle: "italic" }}>
            Content for level {selectedLevel} coming soon!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="finnish-learning-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "4px", fontSize: "18px", fontWeight: 600, color: "var(--brand)" }}>
            My Finnish Journey - Level {selectedLevel}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
            Structured Finnish learning based on the official textbook
          </p>
        </div>
        <button
          onClick={() => handleLevelSelect(null)}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            background: "transparent",
            border: "1px solid var(--muted)",
            borderRadius: "6px",
            cursor: "pointer",
            color: "var(--muted)",
          }}
        >
          Change Level
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: expandedChapter === chapter.id ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s ease-in-out",
            }}
          >
            {/* Chapter Header */}
            <button
              onClick={() => handleChapterToggle(chapter.id)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: expandedChapter === chapter.id ? "#f8faff" : "white",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "20px", fontWeight: "bold", color: "var(--brand)" }}>
                    {chapter.number}
                  </span>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
                    {chapter.title}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", marginLeft: "32px" }}>
                  {chapter.description}
                </p>
              </div>
              <span style={{ fontSize: "20px", color: "var(--muted)" }}>
                {expandedChapter === chapter.id ? "▼" : "▶"}
              </span>
            </button>

            {/* Chapter Content */}
            {expandedChapter === chapter.id && (
              <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0" }}>
                {/* Vocabulary Section */}
                {chapter.vocabulary.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--brand)" }}>
                      📚 Sanasto (Vocabulary)
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "var(--text)" }}>
                      {chapter.vocabulary.map((vocab, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>{vocab}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grammar Section */}
                {chapter.grammar.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--brand)" }}>
                      📝 Kielioppi (Grammar)
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "var(--text)" }}>
                      {chapter.grammar.map((grammar, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>{grammar}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conversation Section */}
                {chapter.conversation && (
                  <div style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--brand)" }}>
                      💬 Puhutaan (Conversation)
                    </h5>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text)" }}>
                      {chapter.conversation}
                    </p>
                  </div>
                )}

                {/* Activities */}
                {chapter.activities.length > 0 && (
                  <div>
                    <h5 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--brand)" }}>
                      🎯 Harjoitukset (Activities)
                    </h5>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
                      {chapter.activities.map((activity) => (
                        <div
                          key={activity.id}
                          onClick={() => onActivityClick(activity.prompt)}
                          style={{
                            padding: "12px",
                            background: "#f8faff",
                            border: "1px solid #dbeafe",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "16px" }}>{getActivityIcon(activity.type)}</span>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                              {activity.title}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
                            {activity.description}
                          </p>
                          <div style={{ fontSize: "11px", color: "var(--brand)", marginTop: "8px", fontWeight: 500 }}>
                            Click to practice with Knuut →
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

